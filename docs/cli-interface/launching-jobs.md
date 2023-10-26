---
sidebar_position: 1
---

# Launching Jobs

Job is a unit of work that you want to send to the cluster and let
Fair decide which node to execute it on.

The workflow is roughly the following:
1. Create job description and send it to Fair.
2. Job is queued until a node that can handle the job is found.
3. Node retrieves a job and starts execution. When job is assigned,
   it behaves as though you've sent it directly to the node using `fair node run`
   command. See [Communicating with Nodes](./communicating-with-nodes)
   section to get more information on how to start jobs directly on the nodes.
4. If no compatible node was found for a set period of time, job is considered
   EXPIRED and is removed from the queue.

Here is an example on how to start a job:
```shell
$ fair task -i python:slim python -c "print('Hello Fair Compute')"
Hello Fair Compute
```

## Get Job Information

To get information about the job use the following command:
```shell
$ fair job info <JOB_ID>
```

Note that when job expires, job status will be `EXPIRED` for some time.
After a set period of time job will be completely removed and job info
command will say that job is not found.

## End-to-end Example

To demonstrate usage of the job command we're going to start with an empty
cluster. Send a job to the cluster. Then start one node and observe how
job is being scheduled and executed.

```shell
# start with an empty cluster
$ fair cluster info

# schedule a job
$ fair job -i python:slim python -c "import time; print('Start'); time.sleep(10); print('Finish')"

# status should be queued
$ fair job info ...

# start fair desktop app locally in another terminal
$ fair-deskop

# now the job should be in running status
$ fair job info ...

# after 10 seconds job is in complete state
$ fair job info ...
```
