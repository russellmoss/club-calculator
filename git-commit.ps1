# Git commit helper script
param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)

$env:GIT_EDITOR = "notepad"
git commit --no-verify -m $Message 