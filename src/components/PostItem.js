import { useContext, useEffect, useState, useCallback } from "react";
import { UserContext } from "./UserContext";
import { doc, deleteDoc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export function PostItem({ post }) {
  const { user } = useContext(UserContext);
  const [postOwnerEmail, setPostOwnerEmail] = useState(null);

  const getOwnerEmail = useCallback(async () => {
    try {
      const docRef = doc(db, "users", post.owner);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists) {
        setPostOwnerEmail(docSnap.data().email);
      } else {
        console.log("docSnap not exists");
      }
    } catch (error) {
      console.log(error);
    }
  }, [post.owner]);

  useEffect(() => {
    if (!post || !post?.owner) return;

    getOwnerEmail();
  }, [post, getOwnerEmail]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const title = e.target.title2.value.trim();
    const content = e.target.content2.value.trim();
    if (!title && !content) return;

    try {
      const postRef = doc(db, "posts", post.id);
      await setDoc(
        postRef,
        {
          title: title || post.title,
          content: content || post.content,
          modifiedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.log(error);
    } finally {
      e.target.title2.value = "";
      e.target.content2.value = "";
    }
  };

  const handleDelete = async () => {
    try {
      const postRef = doc(db, "posts", post.id);
      await deleteDoc(postRef);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center">
      <div
        className={`${
          user && post.owner === user.uid ? "border-4 border-green-500" : ""
        } flex flex-col w-full bg-purple-50 rounded-xl px-4 py-2 shadow-md max-w-sm`}
      >
        <div className="flex items-center space-x-2">
          <div className="text-sm">
            {post?.createdAt && new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
          </div>
          {postOwnerEmail && (
            <>
              <div>·</div>
              <div className="text-sm">{postOwnerEmail}</div>
            </>
          )}
        </div>
        <div className="font-bold">{post.title}</div>
        <div className="bg-white rounded-xl p-3 my-3">{post.content}</div>

        {/* {user && post.owner === user.uid && ( */}
        {
          <div
            className={`${
              user && post.owner === user.uid ? "bg-green-200" : "bg-pink-200"
            } flex items-end justify-center rounded-xl space-x-2 p-3 `}
          >
            <form onSubmit={handleUpdate}>
              <label htmlFor="title2">
                <input
                  type="text"
                  id="title2"
                  name="title2"
                  className="rounded-xl border-2 border-black px-4 py-1"
                  placeholder="new title2"
                />
              </label>
              <label htmlFor="content2">
                <input
                  type="text"
                  id="content2"
                  name="content2"
                  className="rounded-xl border-2 border-black px-4 py-1"
                  placeholder="new content2"
                />
              </label>
              <button className="bg-white rounded-full px-6 py-1 mt-3">Update</button>
            </form>

            <button onClick={handleDelete} className="bg-white rounded-full px-6 py-1 mt-3">
              Delete
            </button>
          </div>
        }
      </div>
    </div>
  );
}
