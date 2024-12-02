#
# run.sh
# --- 
# Runs a Python3 script in module mode given its filename.
# 

# --- retrieve filename --- # 
filename=$1 

# --- remove filename from arguments --- # 
shift

# --- run python script --- # 
node $filename $@
