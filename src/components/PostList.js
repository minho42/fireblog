import { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  limit,
  query,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { PostItem } from "./PostItem";
import { Link } from "react-router-dom";

export const PostList = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const colRef = collection(db, "posts");
    const snapshot = await getDocs(colRef);
    setPosts(
      snapshot.docs.map((doc) => {
        return doc.data();
      })
    );
  };

  useEffect(() => {
    // getPosts(); // update, delete doesn't work with this ->

    const colRef = collection(db, "posts");
    const q = query(colRef, orderBy("createdAt", "desc"), limit(100));
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
    if (!user) return;

    const title = e.target.title.value.trim();
    const content = e.target.content.value.trim();
    if (!title && !content) return;

    e.target.title.value = "";
    e.target.content.value = "";

    const docRef = doc(collection(db, "posts"));
    await setDoc(docRef, {
      title,
      content,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
      owner: user.uid,
    });
  };

  return (
    <div className="flex justify-center space-y-3 mb-20">
      <div className="flex flex-col w-full  space-y-3">
        <h1 className="text-3xl text-center">Posts ({posts && posts.length})</h1>

        {user ? (
          <div className="flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full items-center justify-center space-y-1"
            >
              <label htmlFor="title">
                title
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="rounded-lg border-2 border-black px-4 py-1"
                  placeholder="title"
                />
              </label>
              <label htmlFor="content">
                content
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
        ) : (
          <div className="flex justify-center">
            <Link to="/auth">
              <div className="border-b-2 border-black">Please login</div>
            </Link>
          </div>
        )}

        <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts && posts.map((post) => <PostItem key={post.id} post={post} />)}
        </article>
      </div>
    </div>
  );
};
