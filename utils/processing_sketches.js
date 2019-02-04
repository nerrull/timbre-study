var get_texture_sketch= function(params) {
    var texture_sketch = function (p) {
        var started = false;
        var ended = false;
        var images = [];
        var hover_idx = -1;
        var trial = params.trial
        var trial_data = params.trial_data
        var playTarget = params.playTarget
        var player = params.player
        var imSize = params.imSize
        var headerHeight = params.headerHeight
        var headerMessage = params.headerMessage
        var startMessageString =params.startMessageString
        var progressString = params.progressString
        var lookup_array = params.lookup_array
        var nodeGraph = params.nodeGraph
        var end_trial = params.end_trial
        
        p.setup = function () {
          p.createCanvas(trial.dims[0] + imSize, headerHeight + trial.dims[1] + imSize);
    
          //Load images
          console.log(trial.images.length);
          for (let idx = 0; idx < trial.images.length; idx++) {
            images.push(p.loadImage(trial.images[idx]));
            console.log(trial.images[idx]);
          }
          p.textSize(32);
          p.frameRate(30);
          playTarget();
        };
    
        p.draw = function () {
          if (ended){
            let m = "Correct!"
            p.background(150);
            p.push();
            p.translate(p.width / 2, p.height / 2);
            p.fill(30);
            var text_width = p.textWidth(m);
            p.rect(-text_width / 2 - 10, -40, text_width + 20, 60);
            p.fill(255);
            p.text(m, -text_width / 2, 0);
            p.pop();
            return;
          }
          //Draw default screen
          if (!started) {
            p.background(150);
            p.push();
            p.translate(p.width / 2, p.height / 2);
            p.fill(30);
            var text_width = p.textWidth(startMessageString);
            p.rect(-text_width / 2 - 10, -40, text_width + 20, 60);
            p.fill(255);
            p.text(startMessageString, -text_width / 2, 0);
            p.pop();
            p.noStroke();
            p.fill(128, 0, 0);
            p.rect(0, 0, 50, 50);
            p.fill(255);
            p.text("<---- Place mouse here", 52, 30);
            return;
          }
    
          //Trial screen
          p.background(240);
          p.drawHeader();
    
          for (let idx = 0; idx <  nodeGraph.nodes.length; idx++) {
            let n = nodeGraph.nodes[idx];
            if (hover_idx == idx) {
              p.stroke(0, 255, 0);
              p.fill(0, 255, 0);
              p.rect(n.x - 3 - imSize/2,n.y - 3-imSize/2, imSize + 6, imSize + 5)
            }
            p.image(images[idx], n.x -imSize/2, n.y- imSize/2, imSize, imSize);
          }
    
          if (p.frameCount % 5 == 0) {
            var mouseX = Math.floor(p.mouseX);
            var mouseY = Math.floor(p.mouseY);
            trial_data.mousePosition.push([mouseX, mouseY]);
          }
        };
    
        p.drawHeader = function () {
          var progress_width = 150;
          var progress_height = 15;
          var header_content_offset = 30;
    
          p.push();
          p.textSize(24);
          p.noStroke();
    
          p.fill(255);
          p.rect(0, 0, p.width, headerHeight);
          p.fill(0);
          p.text(headerMessage, 3, header_content_offset);
          // p.rect(0,headerHeight-3, p.width,3);
    
          var progress_string_width = p.textWidth(progressString);
    
          p.translate(p.width - (progress_width + 10), 0);
          p.text(progressString, -progress_string_width - 5, header_content_offset);
          // console.log("Framerate: " +p.frameRate())
          p.fill(0, 50, 100);
          p.rect(0, header_content_offset - progress_height, (progress_width * trial.trial_index) / trial.num_trials, progress_height);
          p.stroke(120);
          p.strokeWeight(3);
          p.noFill();
          p.rect(0, header_content_offset - progress_height, progress_width, progress_height);
          p.pop();
        }
    
        p.mousePressed = function () {
          var mouseX = Math.floor(p.mouseX);
          var mouseY = Math.floor(p.mouseY);
    
          if (!started||ended) {
            return;
          }
          if (mouseX >= p.width || mouseY >= p.height) {
            return;
          }
          let image_index = lookup_array[mouseX][mouseY];
          if (image_index == -1) {
            return;
          }
          else if (image_index != trial.target_index) {
            misclick_increment(image_index);
            console.log(`Misclick on ${image_index} `)
          }
          else if (image_index == trial.target_index) {
            console.log(`Correct click on ${image_index}`)
            end_trial()
            ended = true;
          }
        };
    
        p.mouseMoved = function () {
          var mouseX = Math.floor(p.mouseX);
          var mouseY = Math.floor(p.mouseY);
          if (ended){
            return;
          }
    
          if (!started || ended) {
            return;
          }
          if (mouseX >= p.width || mouseY >= p.height ||mouseX<0 ||mouseY<0) {
            return;
          }
          let image_index = lookup_array[mouseX][mouseY];
          hover_idx = image_index;
          if (image_index != -1) {
            if (lastMouseIndex != image_index) {
              player.playSound(image_index);
            }
          }
          lastMouseIndex = image_index;
        };
    
        p.keyPressed = function () {
          if (ended){
            return;
          }
          //Pressing space bar starts the experiment and plays the target sound
          if (!started) {
            if (p.mouseX < 50 && p.mouseX > 0 && p.mouseY < 50 && p.mouseY > 0) {
              console.log("Starting experiment!")
              //start timer
              started = true;
              trial_data.start_time = new Date();
              makeLookupArray();
            }
            return false;
          }
    
          playTarget();
          // Spacebar
          if (p.keyCode == 49) {
    
          }
          return false;
        }
      };
      return texture_sketch;
}

var get_color_sketch= function(params) {
    var texture_sketch = function (p) {
        var started = false;
        var ended = false;
        var hover_idx = -1;
        var trial = params.trial
        var trial_data = params.trial_data
        var playTarget = params.playTarget
        var player = params.player
        var imSize = params.imSize
        var headerHeight = params.headerHeight
        var headerMessage = params.headerMessage
        var startMessageString =params.startMessageString
        var progressString = params.progressString
        var lookup_array = params.lookup_array
        var nodeGraph = params.nodeGraph
        var end_trial = params.end_trial

        
        p.setup = function () {
          p.createCanvas(trial.dims[0] + imSize, headerHeight + trial.dims[1] + imSize);
          p.textSize(32);
          p.frameRate(30);
          playTarget();
        };
    
        p.draw = function () {
          if (ended){
            let m = "Correct!"
            p.background(150);
            p.push();
            p.translate(p.width / 2, p.height / 2);
            p.fill(30);
            var text_width = p.textWidth(m);
            p.rect(-text_width / 2 - 10, -40, text_width + 20, 60);
            p.fill(255);
            p.text(m, -text_width / 2, 0);
            p.pop();
            return;
          }
          //Draw default screen
          if (!started) {
            p.background(150);
            p.push();
            p.translate(p.width / 2, p.height / 2);
            p.fill(30);
            var text_width = p.textWidth(startMessageString);
            p.rect(-text_width / 2 - 10, -40, text_width + 20, 60);
            p.fill(255);
            p.text(startMessageString, -text_width / 2, 0);
            p.pop();
            p.noStroke();
            p.fill(128, 0, 0);
            p.rect(0, 0, 50, 50);
            p.fill(255);
            p.text("<---- Place mouse here", 52, 30);
            return;
          }
    
          //Trial screen
          p.background(240);
          p.drawHeader();
    
          for (let idx = 0; idx < nodeGraph.nodes.length; idx++) {
            let n = nodeGraph.nodes[idx];
            if (hover_idx == idx) {
              p.stroke(0, 0, 0);
              p.fill(0, 0, 0);
              p.ellipse(n.x ,n.y , imSize + 6, imSize + 6)
            }
            p.fill(trial.colors[idx][0]*255, trial.colors[idx][1]*255,trial.colors[idx][2]*255)
            p.ellipse( n.x, n.y, imSize, imSize);
            p.stroke(255, 255, 255);

          }
    
          if (p.frameCount % 5 == 0) {
            var mouseX = Math.floor(p.mouseX);
            var mouseY = Math.floor(p.mouseY);
            trial_data.mousePosition.push([mouseX, mouseY]);
          }
        };
    
        p.drawHeader = function () {
          var progress_width = 150;
          var progress_height = 15;
          var header_content_offset = 30;
    
          p.push();
          p.textSize(24);
          p.noStroke();
    
          p.fill(255);
          p.rect(0, 0, p.width, headerHeight);
          p.fill(0);
          p.text(headerMessage, 3, header_content_offset);
   
          var progress_string_width = p.textWidth(progressString);
    
          p.translate(p.width - (progress_width + 10), 0);
          p.text(progressString, -progress_string_width - 5, header_content_offset);
          // console.log("Framerate: " +p.frameRate())
          p.fill(0, 50, 100);
          p.rect(0, header_content_offset - progress_height, (progress_width * trial.trial_index) / trial.num_trials, progress_height);
          p.stroke(120);
          p.strokeWeight(3);
          p.noFill();
          p.rect(0, header_content_offset - progress_height, progress_width, progress_height);
          p.pop();
        }
    
        p.mousePressed = function () {
          var mouseX = Math.floor(p.mouseX);
          var mouseY = Math.floor(p.mouseY);
    
          if (!started||ended) {
            return;
          }
          if (mouseX >= p.width || mouseY >= p.height) {
            return;
          }
          let image_index = lookup_array[mouseX][mouseY];
          if (image_index == -1) {
            return;
          }
          else if (image_index != trial.target_index) {
            misclick_increment(image_index);
            console.log(`Misclick on ${image_index} `)
          }
          else if (image_index == trial.target_index) {
            console.log(`Correct click on ${image_index}`)
            end_trial()
            ended = true;
          }
        };
    
        p.mouseMoved = function () {
          var mouseX = Math.floor(p.mouseX);
          var mouseY = Math.floor(p.mouseY);
          if (ended){
            return;
          }
    
          if (!started || ended) {
            return;
          }
          if (mouseX >= p.width || mouseY >= p.height ||mouseX<0 ||mouseY<0) {
            return;
          }
          let image_index = lookup_array[mouseX][mouseY];
          hover_idx = image_index;
          if (image_index != -1) {
            if (lastMouseIndex != image_index) {
              player.playSound(image_index);
            }
          }
          lastMouseIndex = image_index;
        };
    
        p.keyPressed = function () {
          if (ended){
            return;
          }
          //Pressing space bar starts the experiment and plays the target sound
          if (!started) {
            if (p.mouseX < 50 && p.mouseX > 0 && p.mouseY < 50 && p.mouseY > 0) {
              console.log("Starting experiment!")
              //start timer
              started = true;
              trial_data.start_time = new Date();
              makeLookupArray();
            }
            return false;
          }
    
          playTarget();
          // Spacebar
          if (p.keyCode == 49) {
    
          }
          return false;
        }
      };
      return texture_sketch;
}


var get_shape_sketch= function(params) {
    var sketch = function (p) {
        var started = false;
        var ended = false;
        var hover_idx = -1;
        var contours = [];

        var trial = params.trial
        var trial_data = params.trial_data
        var playTarget = params.playTarget
        var player = params.player
        var imSize = params.imSize
        var headerHeight = params.headerHeight
        var headerMessage = params.headerMessage
        var startMessageString =params.startMessageString
        var progressString = params.progressString
        var lookup_array = params.lookup_array
        var nodeGraph = params.nodeGraph
        var end_trial = params.end_trial
        var envelopes = params.trial.envelopes
        var drawDebug = params.drawDebug

        
        p.setup = function () {
          p.createCanvas(trial.dims[0] + imSize, headerHeight + trial.dims[1] + imSize);
          p.textSize(32);
          p.frameRate(30);
          playTarget();
        };

    
        p.draw = function () {

          if (ended){
            let m = "Correct!"
            p.background(150);
            p.push();
            p.translate(p.width / 2, p.height / 2);
            p.fill(30);
            var text_width = p.textWidth(m);
            p.rect(-text_width / 2 - 10, -40, text_width + 20, 60);
            p.fill(255);
            p.text(m, -text_width / 2, 0);
            p.pop();
            return;
          }
          //Draw default screen
          if (!started) {
            p.background(150);
            p.push();
            p.translate(p.width / 2, p.height / 2);
            p.fill(30);
            var text_width = p.textWidth(startMessageString);
            p.rect(-text_width / 2 - 10, -40, text_width + 20, 60);
            p.fill(255);
            p.text(startMessageString, -text_width / 2, 0);
            p.pop();
            p.noStroke();
            p.fill(128, 0, 0);
            p.rect(0, 0, 50, 50);
            p.fill(255);
            p.text("<---- Place mouse here", 52, 30);
            return;
          }
    
          //Trial screen
          p.background(240);
          p.drawHeader();
    
          for (let idx = 0; idx < nodeGraph.nodes.length; idx++) {
            let n = nodeGraph.nodes[idx];

            var n_steps = envelopes[idx].length*2;
            var arc_rad = 2*p.PI/n_steps 
            var arc_step = -p.PI/2 + arc_rad/2;
            
            if (hover_idx == idx) {
              p.stroke(0, 0, 0);
              p.fill(0, 255, 0);
              p.beginShape();
              for (var i in envelopes[idx]){
                  let inc =  envelopes[idx][i]*0.5
                  let x  = p.cos(arc_step)*(0.7+inc)*imSize/2;
                  let y  = p.sin(arc_step)*(0.7+inc)*imSize/2;
                  p.vertex(n.x+x, n.y+y);
                  arc_step+=arc_rad;
              }
              for (var i in envelopes[idx].reverse()){
                  let inc =  envelopes[idx][i]*0.5
                  let x  = p.cos(arc_step)*(0.7+inc)*imSize/2;
                  let y  = p.sin(arc_step)*(0.7+inc)*imSize/2;
                  p.vertex(n.x+x, n.y+y);
                  arc_step+=arc_rad;
              }      
              envelopes[idx].reverse()

              p.endShape(p.CLOSE);        
            }


            var n_steps = envelopes[idx].length*2;
            var arc_rad = 2*p.PI/n_steps 
            var arc_step = -p.PI/2 + arc_rad/2;
            var ellipse_portion =0.4;
            var spec_portion = 0.6;
            p.beginShape();
            for (var i in envelopes[idx]){
                let inc =  envelopes[idx][i]*0.5
                let x  = p.cos(arc_step)*(0.5+inc)*imSize/2;
                let y  = p.sin(arc_step)*(0.5+inc)*imSize/2;
                p.vertex(n.x+x, n.y+y);
                arc_step+=arc_rad;
            }
            for (var i in envelopes[idx].reverse()){
                let inc =  envelopes[idx][i]*0.5
                let x  = p.cos(arc_step)*(0.5+inc)*imSize/2;
                let y  = p.sin(arc_step)*(0.5+inc)*imSize/2;
                p.vertex(n.x+x, n.y+y);
                arc_step+=arc_rad;
            }
            envelopes[idx].reverse()

            p.fill(15, 200,200)
            p.stroke(255, 255, 255);
            p.endShape(p.CLOSE);

          }
    
          if (p.frameCount % 5 == 0) {
            var mouseX = Math.floor(p.mouseX);
            var mouseY = Math.floor(p.mouseY);
            trial_data.mousePosition.push([mouseX, mouseY]);
          }
        };
    
        p.drawHeader = function () {
          var progress_width = 150;
          var progress_height = 15;
          var header_content_offset = 30;
    
          p.push();
          p.textSize(24);
          p.noStroke();
    
          p.fill(255);
          p.rect(0, 0, p.width, headerHeight);
          p.fill(0);
          p.text(headerMessage, 3, header_content_offset);

          
          var progress_string_width = p.textWidth(progressString);
    
          p.translate(p.width - (progress_width + 10), 0);
          // p.text(progressString, -progress_string_width - 5, header_content_offset);
          // p.fill(0, 50, 100);
          // p.rect(0, header_content_offset - progress_height, (progress_width * trial.trial_index) / trial.num_trials, progress_height);
          // p.stroke(120);
          // p.strokeWeight(3);
          // p.noFill();
          // p.rect(0, header_content_offset - progress_height, progress_width, progress_height);
          
          if (drawDebug){
            p.fill(0, 0,0,);
            p.stroke(0,0,0);
            p.text(p.frameRate(), 0,header_content_offset);

          }
          
          p.pop();


        }
    
        p.mousePressed = function () {
          var mouseX = Math.floor(p.mouseX);
          var mouseY = Math.floor(p.mouseY);
    
          if (!started||ended) {
            return;
          }
          if (mouseX >= p.width || mouseY >= p.height) {
            return;
          }
          let image_index = lookup_array[mouseX][mouseY];
          if (image_index == -1) {
            return;
          }
          else if (image_index != trial.target_index) {
            misclick_increment(image_index);
            console.log(`Misclick on ${image_index} `)
          }
          else if (image_index == trial.target_index) {
            console.log(`Correct click on ${image_index}`)
            end_trial()
            ended = true;
          }
        };
    
        p.mouseMoved = function () {
          var mouseX = Math.floor(p.mouseX);
          var mouseY = Math.floor(p.mouseY);
          if (ended){
            return;
          }
    
          if (!started || ended) {
            return;
          }
          if (mouseX >= p.width || mouseY >= p.height ||mouseX<0 ||mouseY<0) {
            return;
          }
          let image_index = lookup_array[mouseX][mouseY];
          hover_idx = image_index;
          if (image_index != -1) {
            if (lastMouseIndex != image_index) {
              player.playSound(image_index);
            }
          }
          lastMouseIndex = image_index;
        };
    
        p.keyPressed = function () {
          if (ended){
            return;
          }
          //Pressing space bar starts the experiment and plays the target sound
          if (!started) {
            if (p.mouseX < 50 && p.mouseX > 0 && p.mouseY < 50 && p.mouseY > 0) {
              console.log("Starting experiment!")
              //start timer
              started = true;
              trial_data.start_time = new Date();
              makeLookupArray();
            }
            return false;
          }
    
          playTarget();
          // Spacebar
          if (p.keyCode == 49) {
    
          }
          return false;
        }
      };
      return sketch;
}
