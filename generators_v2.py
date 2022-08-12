import itertools, math, mido, pyaudio, numpy as np, threading
from matplotlib import pyplot as plt


# def samples(n):
#     num = 0
#     while num < n:
#         yield num
#         num += 1

# samp = samples(100)
freq = 1
DURATION = 1
SAMPLE_RATE = 44100
CHUNK = 1024
midi_on_off = True
OCTAVE_DIVISIONS = 12

# for i in samp:

#     print(i)


def sin_osc(freq, amp= 1, sr=SAMPLE_RATE):
    inc = (2*math.pi * freq)/sr
    for v in itertools.count(0, inc):
        yield math.sin(v) * amp

in_port = mido.open_input('Sensel Morph')

p = pyaudio.PyAudio()



# osc = sin_osc(freq)
# osc2 = sin_osc(freq*2)
# osc3 = sin_osc(freq*3)
# osc4 = sin_osc(freq*4)
# osc5 = sin_osc(freq*5)
# sampz = [next(osc)+next(osc2)+next(osc3)+next(osc4)+next(osc5)  for i in range(SAMPLE_RATE*DURATION)]
# sampz2 = [next(osc2) for i in range(SAMPLE_RATE*DURATION)]
# print(sampz)

# plt.plot(sampz)
# # plt.plot(sampz2)
# plt.show()

def play_note(type, note, vel) :
    # print(type, note, vel)
    stream = p.open(format=pyaudio.paInt16,
                channels=1,
                rate=SAMPLE_RATE,
                output=True,
                frames_per_buffer=CHUNK)
    if type == 'note_on' :
        f = pow(2, (note - 69)/OCTAVE_DIVISIONS)*440
        # print(f"{f}Hz")
        osc = sin_osc(f,amp=vel/127./20.)
        while True:    
            samples = np.int16([(int(next(osc)*32767)) for i in range(CHUNK)])
            # print((samples))
            stream.write(samples.tobytes())


def midi_threading_func():
    '''function to run all MIDI input in it's own thread
    '''
    global in_port
    while midi_on_off: 
       
       msg = in_port.receive(block=False) # default is to be a blocking function (i.e. stops the rest of the program from executing )
       if type(msg) == mido.Message :
            if msg.type == 'note_on':
                threading.Thread(target=play_note, args=(msg.type, msg.note, msg.velocity)).start()
       
# create independent thread for MIDI data
midi_thread = threading.Thread(target=midi_threading_func)
#start midi thread
midi_thread.start()



# while True :
#     for msg in inport:
#         print(msg)
#         if msg.type == 'note_on' :
            
            
#             note_playing = True
           

            
        
            
#             # print("HEY")

            

