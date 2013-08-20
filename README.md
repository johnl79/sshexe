## Example
```
var conf = {username: "USERNAME", 
            privateKey: "PATH_TO_PRIVATE_KEY",
            bash: ['uptime',
                   'uname -a',
                   'echo "It worked!"']}
se = require("sshexe")
se(conf, function(err) {
  if (err) throw err;
  console.log("Test success");
})
```

## Config parameters

### host
Default -- `localhost`

The hostname of the ssh server to execute commands against.


### port
Default -- `22`

The port on the ssh server to connect to.


### username
Default -- `root`

The username to authenticate as for the ssh session. This might be a bad 
default.


### privateKey
Default -- `"$HOME/.ssh/id\_rsa"`

The private key to use for authentication. Passed as a string, the full
path to the key file. Need to provide and param to specify a password to
unlock encrypeted keys.


### env
Default -- `{}`

Environment variables to set for the ssh session. Keys are the variable
names, values are the values. Set with an export statement in the beginning of the session. Currently not functioning.


### bash 
Default -- `[]`

A string or array of strings to execute.
