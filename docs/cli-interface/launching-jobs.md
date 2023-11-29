---
sidebar_position: 1
---

# Launching Jobs

Job is a unit of work that you want to send to the cluster and let
Fair decide which node to execute it on.

Here is what is happening when you execute a job on Fair:
1. You create a job description and send it to Fair.
2. Job is queued until a node that can handle the job is found.
3. Node retrieves a job and starts execution.
4. If no compatible node was found for a set period of time, job is considered
   EXPIRED and is removed from the queue.

Here is an example of running a simple Python program:
```shell
fair job -i python:slim -- python -c "print('Hello Fair Compute')"
```

Job output, i.e. `Hello Fair Compute` should be printed to the console.
To start job in a detached mode use `-d` flag. In this case job id will be printed
which later can be used to inspect the job.

## Get Job Information

To get information about the job use the `fair job info <job_id>` command.
Here is an example of how to start a job in detached mode and check its status
```shell
JOB_ID=`fair job -d -i alpine -- sleep 5`
fair job info $JOB_ID
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
fair cluster info

# schedule a job
JOB_ID=`fair job -d -i python:slim -- python -c "import time; print('Start'); time.sleep(5); print('Finish')"`

# status should be queued or processing
fair job info $JOB_ID

# after a little bit - job should be scheduled and the status should be processing
sleep 1
fair job info $JOB_ID

# after 5 seconds job is in complete state
sleep 5
fair job info $JOB_ID
```
