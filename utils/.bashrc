# --- create alias for editing --- # 
function edit() {
	filename=$(fzf --header "--- EDIT FILE ---")
	editor $filename 
	history -s "editor $filename"
}


# -- create alias for running file --- # 
function run() {
	filename=$(fzf --header "--- RUN SCRIPT ---")
	bash run.sh $filename 
	history -s "bash run.sh $filename"
}

