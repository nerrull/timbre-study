

var drawTexture= function(p, nodeGraph, images, imSize, hover_idx, misclicks){
  for (let idx = 0; idx <  nodeGraph.nodes.length; idx++) {
    let n = nodeGraph.nodes[idx];
    if (hover_idx == idx) {
      p.stroke(0, 255, 0);
      p.fill(0, 255, 0);
      p.ellipse(n.x ,n.y , imSize + 6, imSize + 6)
      p.fill(150)
      p.ellipse(n.x ,n.y , imSize, imSize)
    }
    p.noStroke()
    for(var i=0; i<misclicks.length; i++){
      if(misclicks[i] == idx){
        p.strokeWeight(2);
        p.stroke(255,0,0);
        p.ellipse(n.x , n.y, imSize, imSize)
      }
    }
    p.image(images[idx], n.x -imSize/2, n.y- imSize/2, imSize, imSize);

  }
}

var drawColor = function(p, colors, nodeGraph, imSize, hover_idx, misclicks){
  for (let idx = 0; idx < nodeGraph.nodes.length; idx++) {
    let n = nodeGraph.nodes[idx];
    p.noStroke()

    if (hover_idx == idx) {
      
      p.fill(0, 255, 0);
      p.ellipse(n.x ,n.y , imSize + 6, imSize + 6)
      p.fill(150)
      p.ellipse(n.x ,n.y , imSize, imSize)

    }

    for(var i=0; i<misclicks.length; i++){
      if(misclicks[i] == idx){
        p.strokeWeight(2);
        p.stroke(255,0,0);
      }
    }
    p.fill(colors[idx][0]*255, colors[idx][1]*255, colors[idx][2]*255)
    p.ellipse( n.x, n.y, imSize, imSize);
  }
}

var drawBaseline = function(p, nodeGraph, imSize, hover_idx, misclicks){
  p.noStroke()
  for (let idx = 0; idx < nodeGraph.nodes.length; idx++) {
    let n = nodeGraph.nodes[idx];
    if (hover_idx == idx) {
      p.fill(0, 255, 0);
      p.ellipse(n.x ,n.y , imSize + 6, imSize + 6)
      p.fill(150)
      p.ellipse(n.x ,n.y , imSize, imSize)
    }

    p.noStroke()
    for(var i=0; i<misclicks.length; i++){
      if(misclicks[i] == idx){
        p.strokeWeight(2);
        p.stroke(255,0,0);
      }
    }
    p.fill(125, 125,125);
    p.ellipse( n.x, n.y, imSize, imSize);
  }
}

var drawEnvelope= function(p,n, contour, color, radius, offset){
  p.fill(color);
  p.beginShape();

  var n_steps = contour.length*2;
  var arc_rad = 2*p.PI/n_steps 
  var arc_step = -p.PI/2 + arc_rad/2;
  
  for (var i in contour){
      let inc =  contour[i]*0.5
      let x  = p.cos(arc_step)*(offset+inc)*radius;
      let y  = p.sin(arc_step)*(offset+inc)*radius;
      p.vertex(n.x+x, n.y+y);
      arc_step+=arc_rad;
  }
  for (var i in contour.reverse()){
      let inc =  contour[i]*0.5
      let x  = p.cos(arc_step)*(offset+inc)*radius;
      let y  = p.sin(arc_step)*(offset+inc)*radius;
      p.vertex(n.x+x, n.y+y);
      arc_step+=arc_rad;
  } 
  contour.reverse();
  p.endShape(p.CLOSE);       
}

var drawShapes = function(p, nodeGraph, envelopes,imSize, hover_idx, misclicks){
  for (let idx = 0; idx < nodeGraph.nodes.length; idx++) {
    let n = nodeGraph.nodes[idx];

    if (hover_idx == idx) {
      p.fill(0,255,0)
      p.ellipse(n.x, n.y,imSize,imSize)
    }
    let color = p.color(15, 200,200,255)

    p.noStroke()
    for(var i=0; i<misclicks.length; i++){
      if(misclicks[i] == idx){
        p.strokeWeight(1);
        p.stroke(255,0,0);
      }
    }
    drawEnvelope(p,n, envelopes[idx], color, imSize/2, 0.5)    
  }
}

var mask_texture = function(p, texture_img){

}


var get_sketch= function(params) {

    var sketch = function (p) {
        var started = false;
        var ended = false;
        var images = [];
        var hover_idx = -1;
        var trial = params.trial
        var trial_data = params.trial_data
        var player = params.player
        var imSize = params.imSize
        var headerHeight = params.headerHeight
        var headerMessage = params.headerMessage
        var startMessageString =params.startMessageString
        var progressString = params.progressString
        var continueString =params.continueString
        var retryString =params.retryString
        var mouseText = params.mouseText
        var title= params.title
        var subtitle = params.subtitle
        var subsubtitle=  params.subsubtitle
        var lookup_array = params.lookup_array
        var nodeGraph = params.nodeGraph
        var end_trial = params.end_trial
        var envelopes = params.trial.envelopes

        var mode = params.mode
        var retry_pos, retry_radius;
        var continue_pos, continue_radius;

        if (mode == "TEXTURE"){
          p.preload = function () {
            for (let idx = 0; idx < trial.images.length; idx++) {
              images.push(p.loadImage(trial.images[idx]));
            }
          }
          p.apply_mask = function(texture, mask){
            texture.mask(mask);
          }
        }

        p.setup = function () {
          p.createCanvas(trial.dims[0] + imSize, headerHeight + trial.dims[1] + imSize);
          retry_pos =p.createVector(p.width/4, p.height *0.7)
          retry_radius =1;
          continue_pos=p.createVector(3*p.width/4, p.height *0.7)
          continue_radius= 1;


          //Load images
          console.log(trial.images.length);
          if (mode == "TEXTURE"){
            let mask = p.createGraphics(imSize,imSize);
            mask.background(0,0,0,0);
            mask.fill(255,255,255,255);
            mask.ellipse(imSize/2, imSize/2, imSize-2, imSize-2);
            for (let idx = 0; idx < images.length; idx++) {
              p.apply_mask(images[idx], mask);
            }
            mask.remove();
            //console.log(trial.images[idx]);
          }
          p.textSize(32);
          p.frameRate(30);


          // player.playSound(trial.target_index);
        };
    
        p.draw = function () {
          if (ended){
            let m = "Correct!"
            p.background(150);
            p.push();
            p.textSize(32);

            p.translate(p.width / 2, p.height / 2);
            p.fill(30);
            let text_width = p.textWidth(m);
            p.rect(-text_width / 2 - 10, -40, text_width + 20, 60);
            p.fill(255);
            p.text(m, -text_width / 2, 0);
            p.pop();

            if (mode== "PRACTICE"){
              p.stroke(255);
              p.push()
              p.translate(retry_pos.x,retry_pos.y);
              m = retryString
              text_width = p.textWidth(m);
              retry_radius = text_width/2+20;
              p.fill(0,170, 170);
              p.rect(-text_width / 2 - 10, -40, text_width + 20, 60);
              p.fill(255);
              p.text(m, -text_width / 2, 0);
              p.pop()

              p.push()
              p.translate(continue_pos.x, continue_pos.y);
              m = continueString
              text_width = p.textWidth(m);
              continue_radius = text_width/2 +20;
              p.fill(0,170, 0);
              p.rect(-text_width / 2 - 10, -40, text_width + 20, 60);
              p.fill(255);
              p.text(m, -text_width / 2, 0);
              p.pop()             

            }
            return;
          }

          //Draw start screen
          if (!started) {
            p.background(150);
            p.push();

            p.fill(255);
            p.textSize(32);
            p.translate(p.width / 2 , p.height /2 -250);
            let progress_text = title;
            let text_width = p.textWidth(progress_text);
            p.text(progress_text, -text_width / 2, 60);
            p.textSize(24);

            p.translate(0, 60);
            progress_text = subtitle;
            text_width = p.textWidth(progress_text);
            p.text(progress_text, -text_width / 2, 60);
            p.textSize(32);

            p.translate(0, 60);
            progress_text = subsubtitle;
            text_width = p.textWidth(progress_text);
            p.text(progress_text, -text_width / 2, 60);

            p.pop()
            p.push()
            p.translate(p.width / 2, p.height / 2);
            
            p.fill(30);
            text_width = p.textWidth(startMessageString);
            p.rect(-text_width / 2 - 10, -40, text_width + 20, 60);
            p.fill(255);
            p.text(startMessageString, -text_width / 2, 0);

            let ti = trial.task_index+1
            progress_text =  ti + "/" +trial.num_trials;
            text_width = p.textWidth(progress_text);
            p.text(progress_text, -text_width / 2, 100);

            p.pop();
            p.noStroke();
            p.fill(128, 0, 0);
            p.rect(0, 0, 50, 50);
            p.fill(255);
            p.text("<---- " + mouseText, 52, 30);
            return;
          }
    
          //Trial screen
          p.background(240);
          p.drawHeader();
          //debugger;
          p.push();

          console.log(trial_data.misclicks)
          if (mode == "TEXTURE"){
            drawTexture(p, nodeGraph,images, imSize, hover_idx, trial_data.misclicks);
          }
          else if (mode == "COLOR"){
            drawColor(p, trial.colors, nodeGraph,imSize, hover_idx,  trial_data.misclicks)
          }
          else if (mode == "SHAPE"){
            drawShapes(p, nodeGraph,envelopes,imSize, hover_idx,  trial_data.misclicks)
          }
          else if (mode == "BASELINE"){
            drawBaseline(p, nodeGraph, imSize, hover_idx,  trial_data.misclicks)
          }
          else if (mode == "PRACTICE"){
            drawBaseline(p, nodeGraph, imSize, hover_idx, trial_data.misclicks)
            return;
          }
          p.pop();

          if (p.frameCount % 5 == 0) {
            trial_data.mousePosition.push([Math.floor(p.mouseX),Math.floor(p.mouseY)]);
          }
        };
    
        p.drawHeader = function () {
          var progress_width = 150;
          var progress_height = 15;
          var header_content_offset = 30;
    
          p.push();
          p.textSize(18);
          p.noStroke();
    
          p.fill(255);
          p.rect(0, 0, p.width, headerHeight);
          p.fill(0);
          p.text(headerMessage, 3, header_content_offset);
          // p.rect(0,headerHeight-3, p.width,3); 
          p.pop()

          p.push()
          p.fill(0);
          p.textSize(18);

          //Draw progress
          if (mode== "PRACTICE"){
            // p.translate(p.width -  (progress_width + 10), 0);
            // p.text("Practice mode", -40,header_content_offset)
            // p.pop();
            return
          }
          debugger
          var progress_string_width = p.textWidth(progressString);
          p.translate(p.width -  (progress_width + 10), 0);
          p.text(progressString, -progress_string_width - 5, header_content_offset);
          p.fill(0, 50, 100);
          p.rect(0, header_content_offset - progress_height, (progress_width * trial.task_index) / trial.num_trials, progress_height);
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
            if(ended && mode =="PRACTICE"){
                if  ((p.abs(mouseX - retry_pos.x) + p.abs(mouseY - retry_pos.y)) <retry_radius){
                  ended =false;
                  started= false;
                }
                if  ((p.abs(mouseX - continue_pos.x) + p.abs(mouseY - continue_pos.y)) <continue_radius){
                  end_trial(trial_data)
                }
            }
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
            trial_data.misclicks.push(image_index);
            trial_data.num_misclicks += 1;
            console.log(`Misclick on ${image_index} `)
          }
          else if (image_index == trial.target_index) {
            console.log(`Correct click on ${image_index}`)
            
            ended = true;
            if (mode == "PRACTICE"){
              return;
            }
            end_trial(trial_data)
          }
        };
    
        p.mouseMoved = function () {
          let mouseX = Math.floor(p.mouseX);
          let mouseY = Math.floor(p.mouseY);
          if (ended){
            return;
          }
    
          if (!started || ended) {
            return;
          }
          if (mouseX >= p.width || mouseY >= p.height ||mouseX<0 ||mouseY<0) {
            return;
          }
          hover_idx = lookup_array[mouseX][mouseY];
          if (hover_idx != -1) {
            if (lastMouseIndex != hover_idx) {
              player.playSound(hover_idx);
            }
          }
          lastMouseIndex = hover_idx;
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
          // Spacebar
          if (p.key == ' ') {
            trial_data.listen_count += 1;
            player.playSound(trial.target_index);
          }
          return false;
        }
      };
      return sketch;
}



var get_highlight_sketch= function(params) {

  var sketch = function (p) {
      var started = false;
      var ended = false;
      var images = [];
      var hover_idx = -1;
      var trial = params.trial
      var trial_data = params.trial_data
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

      var mode = params.mode
      var retry_pos, retry_radius;
      var continue_pos, continue_radius;
      var highlighted;

      p.setup = function () {
        p.createCanvas(trial.dims[0] + imSize, headerHeight + trial.dims[1] + imSize);
        retry_pos =p.createVector(p.width/4, p.height *0.7)
        retry_radius =1;
        continue_pos=p.createVector(3*p.width/4, p.height *0.7)
        continue_radius= 1;


        //Load images
        console.log(trial.images.length);
        highlighted = new Array(trial.images.length).fill(false)
        p.textSize(32);
        p.frameRate(30);
      };
  
      p.draw = function () {
        if (ended){
          let m = "Success!"
          p.background(150);
          p.push();
          p.translate(p.width / 2, p.height / 2);
          p.fill(30);
          let text_width = p.textWidth(m);
          p.rect(-text_width / 2 - 10, -40, text_width + 20, 60);
          p.fill(255);
          p.text(m, -text_width / 2, 0);
          p.pop();

            p.stroke(255);
            p.push()
            p.translate(retry_pos.x,retry_pos.y);
            m = "Retry"
            text_width = p.textWidth(m);
            retry_radius = text_width/2+20;
            p.fill(0,170, 170);
            p.rect(-text_width / 2 - 10, -40, text_width + 20, 60);
            p.fill(255);
            p.text(m, -text_width / 2, 0);
            p.pop()

            p.push()
            p.translate(continue_pos.x, continue_pos.y);
            m = "Continue"
            text_width = p.textWidth(m);
            continue_radius = text_width/2 +20;
            p.fill(0,170, 0);
            p.rect(-text_width / 2 - 10, -40, text_width + 20, 60);
            p.fill(255);
            p.text(m, -text_width / 2, 0);
            p.pop()             

          
          return;
        }
        //Draw start screen
        if (!started) {
          p.background(150);
          p.push();
          p.translate(p.width / 2, p.height / 2);
          p.fill(30);
          let text_width = p.textWidth(startMessageString);
          p.rect(-text_width / 2 - 10, -40, text_width + 20, 60);
          p.fill(255);
          p.text(startMessageString, -text_width / 2, 0);

          let pi = trial.phase_index
          progress_text = "Practice"
          
          text_width = p.textWidth(progress_text);
          p.text(progress_text, -text_width / 2, 60);
          let ti = trial.task_index+1

          progress_text = "Task " + ti + "/" +trial.num_trials;
          text_width = p.textWidth(progress_text);
          p.text(progress_text, -text_width / 2, 100);

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
        //debugger;

        p.noStroke()
        for (let idx = 0; idx < nodeGraph.nodes.length; idx++) {
          let n = nodeGraph.nodes[idx];
          if (highlighted[idx] == true) {
            p.fill(0, 255, 0);
          }
          else{
            p.fill(150,170,170)
          }
          p.ellipse( n.x, n.y, imSize, imSize);
        }
        ended = highlighted.reduce((a,b)=> a&&b);
         
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
        p.text("Highlight all the elements!", 3, header_content_offset);
        // p.rect(0,headerHeight-3, p.width,3); 
        
        //Draw progress

        p.translate(p.width -  (progress_width + 10), 0);
        p.text("Practice mode", -40,header_content_offset)
        p.pop();
        


      }
  
      p.mousePressed = function () {
        if(ended){
          if  ((p.abs(p.mouseX - retry_pos.x) + p.abs(p.mouseY - retry_pos.y)) <retry_radius){
            ended =false;
            started= false;
            highlighted = new Array(trial.images.length).fill(false)

          }
          if  ((p.abs(p.mouseX - continue_pos.x) + p.abs(p.mouseY - continue_pos.y)) <continue_radius){
            end_trial(trial_data)
          }
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
        hover_idx = lookup_array[mouseX][mouseY];
        if (hover_idx != -1) {
          if (lastMouseIndex != hover_idx) {
            player.playSound(hover_idx);
            highlighted[hover_idx]= true;
            
          }
        }
        lastMouseIndex = hover_idx;
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
        trial_data.listen_count += 1;
        // Spacebar
        if (p.keyCode == 49) {
  
        }
        return false;
      }
    };
    return sketch;
}
