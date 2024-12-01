#
# Creates additional required folders in the project. 
# 

# --- make data/ folder --- # 
echo "Making data/ folder..."
if [ ! -d data/ ] 
then 
    mkdir data/ 
fi 

# --- make temp/ folder --- # 
echo "Making temp/ folder..."
if [ ! -d data/ ] 
then 
    mkdir temp/ 
fi 

echo "Done."



