import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { PostItem } from "./PostItem";

export const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setPosts(
        snap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target.title.value.trim();
    const content = e.target.content.value.trim();
    if (!title && !content) return;

    e.target.title.value = "";
    e.target.content.value = "";

    // saveToDb("posts", { title, content });
    const docRef = doc(collection(db, "posts"));
    await setDoc(docRef, { title, content, createdAt: serverTimestamp(), modifiedAt: serverTimestamp() });
  };

  return (
    <div className="flex justify-center space-y-3">
      <div className="flex flex-col w-full max-w-lg">
        <h1 className="text-3xl text-center">PostList</h1>
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full items-center justify-center space-y-1"
          >
            <label htmlFor="title">
              <input
                type="text"
                id="title"
                name="title"
                className="rounded-lg border-2 border-black px-4 py-1"
                placeholder="title"
              />
            </label>
            <label htmlFor="content">
              <input
                type="text"
                id="content"
                name="content"
                className="rounded-lg border-2 border-black px-4 py-1"
                placeholder="content"
              />
            </label>
            <button className="block bg-purple-200 font-semibold px-4 py-2 rounded-full">Add a post</button>
          </form>
        </div>

        <article className="space-y-1">
          {posts && posts.map((post) => <PostItem key={post.id} post={post} />)}
        </article>
      </div>
    </div>
  );
};
