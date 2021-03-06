# Node Basics


## Types

There are two main node types in n8n: Trigger nodes and Regular nodes.


### Trigger Nodes

The Trigger nodes start a workflow and supply the initial data. A workflow can contain multiple trigger nodes but with each execution, only one of them will execute. This is because the other trigger nodes would not have any input as they are the nodes from which the execution of the workflow starts.


### Regular Nodes

These nodes do the actual work. They can add, remove, and edit the data in the flow as well as request and send data to external APIs. They can do everything possible with Node.js in general.


## Credentials

External services need a way to identify and authenticate users. This data can range from an API key over an email/password combination to a very long multi-line private key and can be saved in n8n as credentials.

Nodes in n8n can then request that credential information. As an additional layer of security credentials can only be accessed by node types which specifically have the right to do so.

To make sure that the data is secure, it gets saved to the database encrypted. A random personal encryption key is used which gets automatically generated on the first run of n8n and then saved under `~/.n8n/config`.


## Expressions

With the help of expressions, it is possible to set node parameters dynamically by referencing other data. That can be data from the flow, nodes, the environment or self-generated data. Expressions are normal text with placeholders (everything between {{...}}) that can execute JavaScript code, which offers access to special variables to access data.

An expression could look like this:

My name is: `{{$node["Webhook"].json["query"]["name"]}}`

This one would return "My name is: " and then attach the value that the node with the name "Webhook" outputs and there select the property "query" and its key "name". So if the node would output this data:

```json
{
  "query": {
    "name": "Jim"
  }
}
```

the value would be: "My name is: Jim"

The following special variables are available:

 - **$binary**: Incoming binary data of a node
 - **$evaluateExpression**: Evaluates a string as expression
 - **$env**: Environment variables
 - **$items**: Environment variables
 - **$json**: Incoming JSON data of a node
 - **$node**: Data of other nodes (binary, context, json, parameter, runIndex)
 - **$parameters**: Parameters of the current node
 - **$runIndex**: The current run index (first time node gets executed it is 0, second time 1, ...)
 - **$workflow**: Returns workflow metadata like: active, id, name

Normally it is not needed to write the JavaScript variables manually as they can be selected with the help of the Expression Editor.


## Parameters

Parameters can be set for most nodes in n8n. The values that get set define what exactly a node does.

Parameter values are static by default and are always the same no matter what kind of data the node processes. However, it is possible to set the values dynamically with the help of an Expression. Using Expressions, it is possible to make the parameter value dependent on other factors like the data of flow or parameters of other nodes.

More information about it can be found under [Expressions](#expressions).


## Pausing Node

Sometimes when creating and debugging a workflow, it is helpful to not execute specific nodes. To do that without disconnecting each node, you can pause them. When a node gets paused, the data passes through the node without being changed.

There are two ways to pause a node. You can either press the pause button which gets displayed above the node when hovering over it or select the node and press ???d???.
