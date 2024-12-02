#
# run.sh
# --- 
# Runs a Python3 script in module mode given its filename.
# 

# --- retrieve filename --- # 
filename=$1 

# --- preprocess filename --- # 
filename=${filename%.*}
filename=$(echo $filename | tr "/" ".")

# --- remove filename from arguments --- # 
shift

# --- run python script --- # 
python3 -m $filename $@
