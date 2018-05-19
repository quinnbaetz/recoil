This is an implementation of Swoops store architecture in it's purest form.
It's a response to redux and attempts to simplify by removing actions and reducers. 
Because we know what changes are made to objects we can be much more intelligent about checking equality and rerendering.
Components are expected to grab changes they want directly from the store, this will set up event listeners to rerender the component when those properties change.

# Examples

## Getting a list 
_(rerenders automatically If and only if something is removed or added to the list)_

```
class JobList extends React.Component
  render: ->
    super()
    job_ids = JobStore.getList('All', @getId())
    for id in job_ids
      JobItem(id: id)
```

## Creating a list in a store
```
class JobStore extends BaseStore
  constructor(args...)
    super(args...)
    @_registerList('PendingJobs', (job) -> job.status == 'Pending')

```

## Using an Object item  
_(rerenders automatically If and only if a used property is changed (status, service))_ 
_currently doesn't work for nested items (i.e. job.service_location.lat)_

```
class JobItem extends React.Component
  render: ->
    super()
    job = JobStore.getWatchedObject(@props.id, @getId())
    div null,
      span null,
        job.service
      span null,
        job.status
```

## Getting a property  
_(rerenders automatically If and only if a used property is changed (status, service))_ 

```
class JobItem extends React.Component
  render: ->
    super()
    div null,
      span null,
        JobStore.get(@props.id, 'service', @getId())
```


## Add an object to the store
_triggers a rerender on any component that cares about this job_
```
JobStore.add(job)
```

## Update an object in the store  changed.  
_triggers a rerender on any component that cares about this job_
_still a work in progress_
```
#If you know what's changed
JobStore.update(job, [status, service]) #prefered

#If you don't know what's changed
JobStore.update(job) #depricated
```


Considerations:
* Proxy isn't supported in IE so we have a polyfill
* Assumes you know the properties that have changed

TODO: 
* Implement warnings and fallbacks (left out for clarity)
* Various optimizations can be done for performance