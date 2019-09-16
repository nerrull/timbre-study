# Audio visualisation study
This repository contains source code for a browser-based study on audio visualisation. 

Study participants are presented with an interactive canvas 

# Set up
Install and launch JATOS on your machine, I recommend following the official guide:
http://www.jatos.org/Get-started.html

Download the zipped study package (this is the easiest way to add a study to JATOS).

On the JATOS homepage, click ''Import study'' and find the zipped package.

The study should appear in the left side-pane.

You can access the source code in ```[your JATOS installation folder]/study_assets_root```.

For the study to be functional, you need a dataset containing sample coordinates, audio envelopes, audio samples, and images. 
You can download our sample dataset from [this link]. Unzip the contents into ```[study source folder]/static/```. This dataset uses samples from the [nSynth dataset](https://magenta.tensorflow.org/datasets/nsynth) and contains ~800 samples of various instruments all playing midi note 64 with 75 velocity.



# Citation
If you use this work in your own research please cite


As well as

JATOS

jsPsych


If you use samples from the NSynth dataset you should cite:

```
@misc{nsynth2017,
    Author = {Jesse Engel and Cinjon Resnick and Adam Roberts and
              Sander Dieleman and Douglas Eck and Karen Simonyan and
              Mohammad Norouzi},
    Title = {Neural Audio Synthesis of Musical Notes with WaveNet Autoencoders},
    Year = {2017},
    Eprint = {arXiv:1704.01279},
}
```






