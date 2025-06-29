---
title: "A complete guide to Tanstack query"
date: 2025-03-14
description: "A comprehensive guide to using Tanstack query for data fetching in React applications."
showToc: true
categories: ["React", "Tanstack"]
tags: ["React", "Tanstack", "Query", "Data Fetching", "Tutorial"]
summary: "A detailed guide explaining how to use Tanstack query for data fetching in React applications, including query keys, query functions, and query hooks."
images: ["/images/tanstack.png"]
---
## 1. What is Tanstack Query?
Tanstack query is a powerful data-fetching library for React, Vue, Svelte, and Solid. It provides a simple and efficient way to manage server state in your applications. With Tanstack Query, you can easily fetch, cache, and synchronize data from your server, making it easier to build fast and responsive applications.

## 2. Advantages of Tanstack Query
- **Data Fetching**: Tanstack Query simplifies the process of fetching data from APIs, allowing you to focus on building your application rather than managing data-fetching logic.
- **Caching**: Tanstack Query automatically caches the data it fetches, reducing the number of network requests and improving performance.
- **Buildin Loading and Error Handling**: Tanstack Query provides built-in loading and error handling states, making it easy to manage the user experience during data fetching.
- **Automatic Refetching**: Tanstack Query can automatically refetch data when it becomes stale or when the user focuses on the application, ensuring that your data is always up to date.
- **Pagination and infinite scrolling**: Tanstack Query provides built-in support for pagination and infinite scrolling, making it easy to manage large datasets.
- **Polling**: Tanstack Query supports polling, allowing you to fetch data at regular intervals to keep it up to date.

## 3. Installing Tanstack Query
To use Tanstack Query in your React application, you need to install the `@tanstack/react-query` package. You can do this using npm or yarn:

```bash
npm install @tanstack/react-query
```

## 4. Getting Started with Tanstack Query
To get started with Tanstack Query, you need to create a `QueryClient` instance and wrap your application with the `QueryClientProvider`. 

Usage of
- `QueryClientProvider`:QueryClientProvider is a React component that provides the QueryClient to your application so that all the part of your app can access the same QueryClient instance.
- `QueryClient`: QueryClient is the core of Tanstack Query. It is responsible for managing the cache, fetching data, and providing the query context to your components

App.jsx
```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        {/* Your application components */}
      </div>
    </QueryClientProvider>
  );
};
```

## 5. Fetching Data with Tanstack Query
we use `useQuery` to get data from server i.e `GET` request
and `useMutation` to send/change data to server i.e `POST`, `PUT`, `DELETE` request


### 5.1. `useQuery` Hook
The `useQuery` hook is used to fetch data from the server and manage the data-fetching state. It takes a query key and a query function as arguments and returns the query result.

```jsx
import { useQuery } from '@tanstack/react-query';
const info = useQuery({
    queryKey: 'todos',
    queryFn: fetchTodos,
});
```
- `queryKey`: A query key is a unique key for query.It can be a string, an array, or an object.The unique key you provide is used internally for refetching, caching, and sharing your queries throughout your application.
- `queryFn`: A query function is a function that fetches the data from the server. It can be an async function or a promise that resolves to the data.
-  `info`: The query result object contains properties like 
    - `data`:  The data returned from the server
    - `error`: The error returned from the server
    - `isPending` : A boolean indicating if the query is currently loading
    - `isError`:  The query encountered an error
    - `isSuccess` : A boolean indicating if the query has succeeded
    - `isFetching`: In any state, if the query is fetching at any time (including background refetching) isFetching will be true.
    - `refetch`: A function that can be called to refetch the data from the server


> Note: `refetch` is a function that can be called to refetch the data from the server. It is useful when you want to manually refetch the data, for example, when the user clicks a button to refresh the data.

> Note : For understanding purpose we can tell that queryKey is like dependency array in useEffect and queryFn is like function in useEffect just because queryFn is called whenever queryKey changes and first time when component mounts.
> ```jsx
> useEffect(() => {
>     queryFn();
> }, [queryKey]);
> ```


### 5.2. Example before using tanstack query
api.jsx
```jsx
import axios from "axios";
const axios=axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 1000,
});

async function fetchData() {
  try {
    const response = await axios.get("/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
```

```jsx
import React, { useState, useEffect } from "react";
import {useState, useEffect} from "react";
import {fetchData} from "./fetchData";

const App=()=>{
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchData();
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
};
export default App;
```

### 5.3. Example after using tanstack query
App.jsx
```jsx
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App=()=>{
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <YourComponent />
    </QueryClientProvider>
  );
};

export default App;
```

api.jsx
```jsx
import axios from "axios";
const axios=axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 1000,
});
export const fetchData = async () => {
  try {
    const response = await axios.get("/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
```
yourComponent.jsx
```jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./api";

const YourComponent = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchData,
  })
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
};
export default YourComponent;
```

## 6. Tanstack Query Devtools
Tanstack Query provides a devtools extension that allows you to inspect and debug your queries in real-time. You can view the cache, query status, and query details using the devtools.

### 6.1. Installing Tanstack Query Devtools
To install the Tanstack Query devtools, you need to add the `@tanstack/react-query-devtools` package to your project:

```bash
npm install @tanstack/react-query-devtools
```
### 6.2. Using Tanstack Query Devtools
To use the Tanstack Query devtools, you need to import the `ReactQueryDevtools` component and add it to your application:

```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
        <YourComponent />
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
```

## 7.Gc Time
When you use React Query to get data,it saves the data in the local cache . This means if you ask for the same data again,React Query give you the saved data instead of making another request 

By default, "inactive" queries are garbage collected after 5 minutes.This means that if query is not used for 5 minutes, then cache for that query will be cleaned up

### 7.1. Whats Happening?
For the first time when the page using useQuery is loaded, the data is fetched from the server and saved in the cache . how long will  cache  last is defined by garbage time

For the second time when the page is loaded, it checks if the data is in the cache or not. If the data is in the cache, it will show the cached data instantly also in background it will check if the data is stale or not. If the data is stale, it will refetch the data from the server and update the cache and show the updated data to the user.
we will learn about stale time in next section

### 7.2. Changing Gc Time
To change the default garbage collection time, you can use
```jsx
const data=useQuery({
  queryKey: ["posts"],
  queryFn: fetchData,
  gcTime: 1000 * 60 * 5, // 5 minutes
})
```

### 7.3 How does useQuery work?
When the page is mounted, the data is fetched from the server and saved in the cache corresponding to the `queryKey` and when the page is reopened ie.visited again the data correspoiding to `querKey` is checked in the cache
- if there is no data corresponding to `queryKey` in the cache, the data is fetched from the server and saved in the cache and shown to the user
- else if there is data in correspoiding to `queryKey` in the cache, the data is shown to the user immediately and in the background, the data is checked if it is stale or not.
    - If the data is stale, the data is refetched from the server and updated in the cache and shown to the user again

### 7.4 Other conditions of refetching
- If data is fresh(not stale) the data is not refetched from the server and the data is shown to the user immediately
- If data is stale, the data is refetched from the server and updated in the cache when
    - the page is revisited
    - When the window is refocused
    - When the network is reconnected
    - when the tab is refocused
    - When the query key changes

## 8. Stale Time
In react Query,StaleTime  is a configuration option that determines how long fetch data is considered fresh before it becomes stale.

 When data is stale, React Query will automatically refetch the data in the background when the component mounts or when the window is refocused or when the network is reconnected. This ensures that your application always has the most up-to-date data without requiring manual refetching.

else it wont

 ### 8.1 Setting the stale time
 To set the stale time, you can use the `staleTime` option in the `useQuery` hook:

 ```jsx
    const data=useQuery({
    queryKey: ["posts"],
    queryFn: fetchData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    })
```

This means for 5 minutes, the data is considered fresh and will not be refetched. After 5 minutes, the data is considered stale and will be refetched from server when the component mounts or when the window is refocused or when the network is reconnected.


## 9. Polling
In react query,polling refers to the technique of fetching data at regular intervals to keep UI up to date with the latest information. This is especially used for scanrios where data changes frequently and you want to ensure that your application always displays the most recent data.
- `refetchInterval`: This option allows you to specify the interval (in milliseconds) at which the query should be refetched. For example, if you set `refetchInterval: 5000`, the query will be refetched every 5 seconds.

- `refetchIntervalInBackground`: This option allows you to specify whether the query should continue to be refetched in the background when the window is not focused. By default, this option is set to `false`, meaning that the query will not be refetched when the window is not focused. You can set it to `true` to enable background refetching.

```jsx
const data=useQuery({
  queryKey: ["posts"],
  queryFn: fetchData,
  refetchInterval: 1000 * 60 * 5, // 5 minutes
  refetchIntervalInBackground: true, // true or false
})
```

> Note: Polling is useful for scenarios where data changes frequently and you want to ensure that your application always displays the most recent data. However, it can also lead to increased network traffic and server load, so use it judiciously.


## 10. Using Query Keys To Fetch Individual Data
```jsx
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./api";
import { useParams } from "react-router-dom";
const YourComponent = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchData(id),
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.body}</p>
      <p>{data.userId}</p>
      <p>{data.id}</p>
    </div>
  );
};
```
For each individual data, the query key should be unique. In this case, we are using the post id to make the query key unique. This ensures that each post is fetched individually and cached separately.

> when the 1st post is fetched, the query key is ["posts", 1] and when the 2nd post is fetched, the query key is ["posts", 2] and so on. This ensures that each post is fetched individually and cached separately. where it is cached as ["posts", 1] and ["posts", 2] and so on
> when the page is revisited, the data is fetched from the cache and shown to the user immediately ie when the first post is visited, the data is fetched from the cache with query key ["posts", 1] and when the second post is visited, the data is fetched from the cache with query key ["posts", 2] and so on and shown to the user immediately and in the background, the data is checked if it is stale or not. If the data is stale, the data is refetched from the server and updated in the cache and shown to the user again

## 11.Pagination
pagination is the process of dividing a large dataset into smaller, more manageable chunks or pages. This is especially useful when dealing with large datasets that may be too large to load all at once. React Query provides built-in support for pagination, making it easy to manage large datasets in your application.

API.JSX
```javascript
import axios from "axios";
const axios=axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 1000,
});
export const fetchData = async (page) => {
  try {
    const response = await axios.get(`/posts?_page=${page}&_limit=10`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
```

aftertanstack.jsx
```javascript
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "./api";

const YourComponent = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => fetchData(page),
    placeholderData:keepPreviousData // This will keep the previous data while fetching new data
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
};
export default YourComponent;
```
What is happening
What is happening
-  setPage(page + 1) Updates the State
  - The onClick handler calls setPage(page + 1), incrementing the page state variable.
  - React re-renders YourComponent, passing the updated page value
- React Query Triggers a New Fetch
  - Since useQuery depends on page (queryKey: ["posts", page]), when page changes, The query function (fetchData(page)) is called with the new page value.
- fetchData(page) Makes an API Call
  - fetchData(page) sends a new GET request to https://jsonplaceholder.typicode.com/posts?_page={newPage}&_limit=10 via Axios.
  - The API returns 10 posts corresponding to the new page.
- React Query Handles Loading and Data
  - While waiting for the new data, isLoading becomes true, displaying "Loading...".
  - Once the data arrives, data is updated, isLoading becomes false, and the UI re-renders with new posts.
- Old Data is Cached (React Query Feature)
  - If you navigate back to a previous page, React Query may serve the cached data instantly while refetching in the backgroun

## 13. useMutation
The useMutation hook is a part of react query and used to perform operation that modify data on server like create,update and delete (CRUD) operations. 

Syntax
```jsx
const { mutate, isLoading, isError, isSuccess ,data,error,} = useMutation({
  mutationFn: (data) => {
    // Perform the mutation
  },
  onSuccess: (data) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  },
});
```

- `onSuccess`: This callback is called when the mutation is successful. You can use this to update the UI or perform any other actions after the mutation is complete.
- `onError`: This callback is called when the mutation fails. You can use this to handle errors and update the UI accordingly.
- `mutationFn`: This is the function that performs the mutation. It should return a promise that resolves when the mutation is complete.
- `onSettled`: A call function that run regardless of success or failure of the mutation. You can use this to perform any cleanup actions or update the UI after the mutation is complete.
- `mutationKey`: A unique key for the mutation in cache(optional)
- `mutate()`: The mutate() function is used to execute mutation in React Query.When you call .mutate() it tells react query to run mutate function inside useMutation hook

## Passing Data to Mutation Function
You can pass data to the mutation function by passing it as an argument to the mutate() function. This allows you to pass dynamic data to the mutation function based on user input or other factors.

example
```jsx
const { mutate, isLoading, isError, isSuccess ,data,error,} = useMutation({
  mutationFn: (id) => {
    return deletePost(id);
  },
  onSuccess: (apiData,id) => {
    // Handle success
  },
  onError: (error,id) => {
    // Handle error
  },
});
const handleDelete = (id) => {
  mutate(id);
};
```
- `apiData`: The data returned from the server after the mutation is successful. You can use this data to update the UI or perform any other actions.
- `id`: The id of the post to be deleted. This id is passed to the mutation function when the handleDelete function is called.

## 14. Simple Update Mutation
```jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "./api";
const YourComponent =()=>{
  const updatedData={title:"new title",body:"new body"};
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (id) => updatePost(id,updatedData),
    //Updating local cache after mutation is successful to reflect changes in UI

      onSuccess: (data,id) => { 
    // if server does not return updated data with id
      queryClient.setQueryData(["posts", id],(oldData)=>{
        return oldData.map((post)=>{
          if(post.id===id){
            return data;
          }
          return post;
        })
      }) 
    },

    // onSucess: (data)=>{
    //   // if server returns updated data with id
    //   queryClient.setQueryData(["posts", data.id],(oldData)=>{
    //     return oldData.map((post)=>{
    //       if(post.id===data.id){
    //         return data;
    //       }
    //       return post;
    //     })
    //   }) 
    // }


    // Invalidating the cache after mutation is successful to forcefully refetch data from server even if there is data in cache

    // onSuccess: (data,id) => {
    // if server doesnt returns updated data 
    //   queryClient.invalidateQueries("posts",id);
    // },
  
    // onSuccess: (data) => {
    // if server returns updated data with id
    //   queryClient.invalidateQueries("posts",data.id);
    // },
})

const handleUpdate = (id) => {
  updateMutation.mutate(id);
};

const App=()=>{
  return <button onClick={() => handleUpdate(1)}>Update Post</button>;
}
```
- `setQueryData`: This function is used to update the local cache with the new data after the mutation is successful. You can use this to reflect the changes in the UI immediately without refetching the data from the server.
- `invalidateQueries`: This function is used to invalidate the cache for a specific query key after the mutation is successful. This forces React Query to refetch the data from the server the next time the query is executed.
