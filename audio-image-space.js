/*
 * Example plugin template
 */

jsPsych.plugins["audio-image-space"] = (function () {

  var plugin = {};

  plugin.info = {
    name: 'audio-image-space',

    parameters: {
      sounds: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Sounds',
        default: undefined,
        description: 'The list of audio samples to be played.'
      },
      images: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Images',
        default: undefined,
        description: 'The list of images to be displayed.'
      },
      coordinates: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Coordinates',
        default: undefined,
        description: 'The list of (x,y)positions of the images.'
      },
      colors: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Colors',
        default: undefined,
        description: 'The list of colors for each sample'
      },
      envelopes: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Envelopes',
        default: undefined,
        description: 'The list of spectral envelopes for each sample'
      },
      dims: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'CanvasDimensions',
        default: [1000, 1000],
        description: 'The x y dimensions of the trial canvas.'
      },
      image_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image Size',
        default: 64,
        description: 'The width (and height) of the images'
      },
      target_index: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Target INdex',
        default: 0,
        description: 'Index of the target sound/image/coordinates'
      },
      mode: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Trial mode',
        default: "baseline",
        description: 'Mode of the trial (color, texture, shape, baseline)'
      },
      task_index: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial index',
        default: 0,
        description: 'Index of the trial'
      },
      phase_index: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'phase index',
        default: 0,
        description: 'Index of the trial phase'
      },
      num_trials: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Number of trials',
        default: 0,
        description: 'Number of Trials in the experiment'
      },
      num_phases: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Number of phases',
        default: 0,
        description: 'Number of phases in the experiment'
      },
      language: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'language',
        default: "default",
        description: 'Number of phases in the experiment'
      },
      volume: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: 'volume',
        default: 1.,
        description: 'Audio playback volume'
      }
    }
  }

  // Uses p5 in instance mode to draw the experiment and handle input
  // https://github.com/processing/p5.js/wiki/Global-and-instance-mode
  plugin.trial = function (display_element, trial) {
    console.log(trial);
    if (trial.mode == "PRACTICE_2"){
      trial.image_size = 32;
    }
    // Data to be saved
    var trial_data = {
      target_index: trial.target_index,
      num_misclicks: 0,
      misclicks: [],
      mousePosition: [],
      task_index: trial.task_index,
      phase: trial.phase_index,
      elapsed_time: -1,
      start_time: -1,
      end_time: -1,
      listen_count: 0,
      mode: trial.mode,
      volume: trial.volume
    };

    //Add a canvas_id div to the display element for p5 to draw to
    display_element.innerHTML = `<div class="TaskPage"> <div class="TaskCanvasContainer"> <div class='TaskCanvas' id='p5_canvas_id'></div></div></div>`;

    //Assert that audio, images and coordinates have the same length
    //TODO


    //Mouse info
    var lastMouseIndex = -1;
    //Layout
    var headerHeight = 50;

    //Todo: language
    messages=  {
      "default":{
        "startMessageString" : "Press the space bar to begin",
        "headerMessage" : "Press the space bar to play the target sound",
        "progressString" : "Progress:",
        "continue": "Continue",
        "retry": "Retry",
        "mouseText": "Place mouse here",
      },
      "fr":{
        "startMessageString" : "Appuyez sur la barre d'espace pour commencer",
        "headerMessage" : "Appuyez sur la barre d'espace pour écouter le son ciblé",
        "progressString" : "Progrès:",
        "continue": "Continuer",
        "retry": "Réessayer",
        "mouseText": "Placez votre curseur ici",
      }
    };
    typeStringsEn = {
      "COLOR": "colors",
      "SHAPE": "shapes",
      "TEXTURE": "textures"
    }
    typeStringsEnSingular = {
      "COLOR": "color",
      "SHAPE": "shape",
      "TEXTURE": "texture"
    }

    typeStringsFR = {
      "COLOR": "couleurs",
      "SHAPE": "formes",
      "TEXTURE": "textures"
    }
    typeStringsFRSingular = {
      "COLOR": "couleur",
      "SHAPE": "form",
      "TEXTURE": "texture"
    }

    partTitles = {
      "default" : ["Practice", "Part 1", "Part 1", "Part 2", "Part 2", "Part 3" ],
      "fr" : ["Pratique", "Partie 1", "Partie 1", "Partie 2", "Partie 2", "Partie 3" ],
    }
    subTitles = {
      "default" : [
        "", 
        "Looking for sounds", "Looking for sounds", 
        "Associating sounds and "+typeStringsEn[trial.mode], "Associating sounds and "+typeStringsEn[trial.mode],
        "Finding sounds using "+  typeStringsEnSingular[trial.mode]
      ],
      "fr" : [
        "", 
        "Recherche de sons", "Recherche de sons", 
        "Association entre sons et "+typeStringsFR[trial.mode] , "Association entre sons et "+typeStringsEn[trial.mode], 
        "Recherche de sons à l'aide de la "+  typeStringsFRSingular[trial.mode]
      ],
    }
    subsubTitles = {
      "default" : ["", "", "Quickly!", "", "Quickly!", "Quickly!"],
      "fr" : ["", "", "Rapidement!", "", "Rapidement!", "Rapidement!"]
    }


    var startMessageString = messages[trial.language]["startMessageString"];
    var headerMessage = messages[trial.language]["headerMessage"];
    var progressString = messages[trial.language]["progressString"];
    var continueString = messages[trial.language]["continue"];
    var retryString = messages[trial.language]["retry"];
    var mouseText=  messages[trial.language]["mouseText"]

    var title=  partTitles[trial.language][trial.phase_index]
    var subtitle=  subTitles[trial.language][trial.phase_index]
    var subsubtitle=  subsubTitles[trial.language][trial.phase_index]


    //Initialize audio elements
    var context = jsPsych.pluginAPI.audioContext();
    var player = new SamplePlayer(context, trial.sounds);
    player.setGain(trial.volume);

    // End the trial and save the data
    var end_trial = function (trial_data) {
      trial_data.end_time = new Date();
      trial_data.elapsed_time = trial_data.end_time - trial_data.start_time;
      console.log(trial_data)
      player.unbind()
      jsPsych.finishTrial(trial_data);
    }


    //Run force directed graph physics sim on points so there's no overlap
    var imSize = trial.image_size;
    var coords = []
    for (let idx = 0; idx < trial.coordinates.length; idx++) {
        let startX = Math.floor(trial.coordinates[idx][0] * trial.dims[0]);
        let startY = headerHeight + Math.floor(trial.coordinates[idx][1] * trial.dims[1]);
        coords.push([startX, startY]);
    }

    var physics = getPhysics(imSize, trial.dims[0], trial.dims[1])     
    var nodeGraph = makeGraph(coords, physics, imSize);
    physics.update();


    //Create and populate array for checking what element is hovered (or clicked)
    var lookup_array = new Array(trial.dims[0] + imSize).fill(-1).map(() => new Array(headerHeight + trial.dims[1] + imSize).fill(-1));
    
    makeLookupArray =function(){
      for (let idx = 0; idx < trial.coordinates.length; idx++) {
        let n = nodeGraph.nodes[idx];
        let startX = Math.round(n.x);
        let startY = Math.round(n.y);
        for (let x = startX-imSize/2; x < startX + imSize/2; x++) {
          for (let y = startY-imSize/2; y < startY + imSize/2; y++) {
            if (x >= lookup_array.length || y >= lookup_array[0].length ||x<0 ||y<0){
              continue;
            }
            lookup_array[x][y] = idx;
          }
        }
      }
    }

    //  create p5 sketch parameters 
    params ={
      "trial":trial,
      "trial_data":trial_data,
      "player":player,
      "imSize":imSize ,
      "headerHeight":headerHeight,
      "headerMessage":headerMessage,
      "startMessageString":startMessageString,
      "progressString": progressString,
      "continueString":continueString,
      "retryString":retryString,
      "mouseText":mouseText,
      "title":title,
      "subtitle":subtitle,
      "subsubtitle":subsubtitle,
      "lookup_array": lookup_array,
      "nodeGraph": nodeGraph,
      "end_trial":end_trial,
      "drawDebug":true,
      "mode": trial.mode,
      
    } 
    //init the sketch
    if (trial.mode == "PRACTICE_2"){
      s= get_highlight_sketch(params);
      var p5Instance = new p5(s, "p5_canvas_id");
    }
    else {
      s= get_sketch(params);
      var p5Instance = new p5(s, "p5_canvas_id");
    }

  };

  return plugin;
})();
