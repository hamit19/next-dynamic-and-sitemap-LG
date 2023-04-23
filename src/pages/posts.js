import { detectGoogleBots } from "@/utils/detectGoogleBots";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Posts = ({ ssr, postsData }) => {
  const [posts, setPosts] = useState(postsData);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );

        setPosts(data);
      } catch (err) {
        console.log(err);
      }
    };

    if (!ssr) {
      fetchPosts();
      console.log("this is CSR!");
    }
  }, []);

  const renderPosts = () => {
    return posts.map((p, index) => <li key={index}>{p.title}</li>);
  };

  if (!posts) return <h1>loading...</h1>;

  return <div>{renderPosts()}</div>;
};

export default Posts;

export const getServerSideProps = async ({ req }) => {
  const userAgent = req.headers["user-agent"];
  let postsData = [];

  const ssr = detectGoogleBots(userAgent);

  if (ssr) {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    postsData = [...data];
    console.log("this is SSR");
  }

  return {
    props: {
      ssr,
      postsData,
    },
  };
};
