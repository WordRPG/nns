#
# convert_to_ba2d.py
# ---
# Converts an .fvecs file to a .bin (ba2d) file
# 
import numpy as np
from extras.python.helpers import fvecs_read
import sys
import array

print("=== BA2D TO FVECS CONVERTER ===")

file = sys.argv[1] 
new_file = sys.argv[2]

# --- read fvecs file --- #
print("Reading file...")
contents = fvecs_read(file) 

# --- saving to file --- # 
print("Saving to file.")
open(new_file, "wb").close()
new_file_obj = open(new_file, "ab")
for i in range(contents.shape[0]):
    print(f"--- Saving {i + 1} of {contents.shape[0]}", end="\r")
    vector = contents[i].tolist()
    vector_b = array.array("f", vector).tobytes()
    new_file_obj.write(vector_b)
    

print("Done.")


