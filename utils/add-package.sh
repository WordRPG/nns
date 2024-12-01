#
# Adds an npm package and links the project folder 
# in node_modules/$ folder.
# 

# --- install packages --- # 
echo "--- INSTALLING PACKAGES" 
npm install $@ 

# --- link project folder --- # 
echo "--- LINKING PROJECT FOLDER" 
ln -s ../ node_modules/$ 

echo "Done."