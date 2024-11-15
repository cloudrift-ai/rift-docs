---
sidebar_position: 2
---

# Managing Clusters

Clusters are the core concept of Rift. A cluster is a set of nodes that
are managed together. You can run jobs on the cluster, inspect the cluster
state, add/remove nodes, add/remove users etc.

The most common use cases for clusters are:
1. Organize nodes into logical groups. For example, you can have a cluster
   for each team in your organization.
2. Run jobs on nodes with specific hardware. For example, you can have a cluster with
   GPU nodes and run jobs that require GPU on this cluster.
3. Share nodes with other users. For example, you can pool compute resources
   together with your friends to run jobs on a larger cluster.

## Default Cluster

By default, all nodes are added to the default cluster and commands will
work with it by default. You can see information about the default cluster
by running the following command:
```shell
rift cluster info
```

## Creating a Cluster

Throughout this tutorial we will be using a cluster named `my_cluster`.
To create a new cluster use:
```shell
rift cluster create my_cluster
```

Now the cluster is created and you can inspect the cluster by running
```shell
rift cluster -c my_cluster info
```

To list all clusters you have access to use
```shell
rift cluster list
```

### Adding Nodes to the Cluster

After creating a cluster you can add nodes to it. By default, all nodes are
added to the default cluster, you can inspect them by invoking:
```shell
rift cluster nodes list
```

Let's add some first node from our default cluster to the `my_cluster` cluster
under the name `my_node`.
```shell
NODE_ID=`rift cluster nodes list | head -n 1 | awk '{print $2}'`
rift cluster -c my_cluster nodes add $NODE_ID my_node
```

Note that **node_id** is a unique identifier of the node in the cluster,
it is not the same as **node_name**. Node name is a human-readable name of
the node to which you can refer to when running jobs.

### Removing Nodes from the Cluster

You can remove nodes from the cluster. For example, let's remove the node
that we just added:
```shell
rift cluster -c my_cluster nodes remove my_node
```

### Renaming Nodes in the Cluster

You can also rename the node at any point in time. It is equivalent to
simply removing and adding the node again. For example, let's add the node
that we've just removed back to the cluster under the name `my_new_node`:
```shell
rift cluster -c my_cluster nodes add $NODE_ID my_new_node
```

However, if node is already in the cluster it is more convenient to use
`rename` command. Let's rename node back to `my_node`:
```shell
rift cluster -c my_cluster nodes rename my_new_node my_node
```

### Adding Users to the Cluster

You can add users to the cluster. Users will be able to run jobs on the cluster.
Users are identified by their email address. For example, to add `some@user.com`
to the cluster you can use the command:
```shell
rift cluster -c my_cluster users add some@user.com
```

Now authorized users can run jobs on the cluster. You can list authorized users by running
the following command:
```shell
rift cluster -c my_cluster users list
```

## Removing the Cluster

Finally, you can remove the cluster by running:
```shell
rift cluster remove my_cluster
```
