

    class SamplePlayer{
        constructor(context, sounds){
            this.soundBuffers = [];
            this.playingIndex = -1;
            this.context =context;
            this.sounds = sounds;

            for (let idx = 0; idx < sounds.length; idx++) {
                console.log(this.sounds[idx]);
                var source = this.context.createBufferSource();
                source.buffer = jsPsych.pluginAPI.getAudioBuffer(this.sounds[idx]);
                source.connect(this.context.destination);
        
                // audio.currentTime = 0;
                source.onended = function () {
                    // audio_reset(idx, false);
                    // console.log(this)
                }.bind(this.audio_reset)
                // audio.addEventListener('ended', audio_reset.bind(null, idx));
                this.soundBuffers.push(source);
            }

        }
        audio_reset(index, stop) {
            if (stop) {
                this.soundBuffers[index].stop();
                this.soundBuffers[index].onended = function () { };
            }
            this.playingIndex = -1;
        }
        //Play a sound specified by index
        playSound(index) {

            //If a different sound was already playing reset it
            if (this.playingIndex != -1) {
                console.log(`Trying to kill ${this.playingIndex}`)
                this.audio_reset(this.playingIndex, true);
            }
    
            //Regenerate the sound source because they're automatically deleted after playing
            this.soundBuffers[index] = this.context.createBufferSource();
            this.soundBuffers[index].buffer = jsPsych.pluginAPI.getAudioBuffer(this.sounds[index]);
            this.soundBuffers[index].connect(this.context.destination);
            this.soundBuffers[index].onended = function (audio_reset) {
                // console.log(`Sound ${index}  ended itself`)
                // console.log(this)
                // debugger;

                // audio_reset(index, false);
            }.bind(this.audio_reset)
    
            //Update playing index and play the sound
            this.soundBuffers[index].start();
            this.playingIndex = index;
        }
        unbind(){     //unbind the audio callbacks
            for (let idx = 0; idx < this.soundBuffers.length; idx++) {
              this.soundBuffers[idx].onended = function () { };
            }
        }
}

   

    
   