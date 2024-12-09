# --- ignore node_modules/ and env/ folder --- #
export FZF_DEFAULT_COMMAND='find . -type d \( -name node_modules -o -name .git -o -name env \) -prune -o -type f -print'


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

# --- shortcut for quickly commiting to github --- # 
function qcp() {
	git add .
	git commit -m "$1"
	git push -u origin main
}


# --- aliases --- # 
alias e=edit
alias r=run
alias q=exit
