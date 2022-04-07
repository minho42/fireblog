import { useContext } from "react";
import { UserContext } from "./UserContext";
import { doc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export function PostItem({ post }) {
  const { user } = useContext(UserContext);

  const handleSubmit = async (e) => {
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
      <div className="flex flex-col w-full bg-purple-50 border-2 border-black rounded-lg px-4 py-2 max-w-sm">
        <div className="flex items-center space-x-2">
          <div className="text-sm">
            {post?.createdAt && new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
          </div>
          <div>·</div>
          <div className="text-sm">{post.owner}</div>
        </div>
        <div className="font-bold">{post.title}</div>
        <div className="bg-white rounded-lg p-3 my-3">{post.content}</div>

        {post.owner === user.uid && (
          <div className="flex items-end justify-center space-x-2">
            <form onSubmit={handleSubmit}>
              <label htmlFor="title2">
                <input
                  type="text"
                  id="title2"
                  name="title2"
                  className="rounded-lg border-2 border-black px-4 py-1"
                  placeholder="new title2"
                />
              </label>
              <label htmlFor="content2">
                <input
                  type="text"
                  id="content2"
                  name="content2"
                  className="rounded-lg border-2 border-black px-4 py-1"
                  placeholder="new content2"
                />
              </label>
              <button className="bg-purple-200 rounded-full px-6 py-1 mt-3">Update</button>
            </form>

            <button onClick={handleDelete} className="bg-purple-200 rounded-full px-6 py-1 mt-3">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
