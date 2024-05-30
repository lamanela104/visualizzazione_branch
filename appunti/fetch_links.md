# Link generici
## GitHub
https://api.github.com/repos/{owner}/{repo}/commits         
https://api.github.com/repos/{owner}/{repo}/branches        
?per_page=1

### esempio
https://github.com/vuejs/core
https://api.github.com/repos/vuejs/core/commits?per_page=1


## BitBucket
https://api.bitbucket.org/2.0/repositories/{username}/{repo}/commits[/{branch | hash}]  
https://api.bitbucket.org/2.0/repositories/{username}/{repo}/refs/branches

?pagelen=1


### esempio
https://bitbucket.org/evzijst/interruptingcow/commits/branch/master
https://api.bitbucket.org/2.0/repositories/evzijst/interruptingcow/commits
https://api.bitbucket.org/2.0/repositories/evzijst/interruptingcow/refs/branches
