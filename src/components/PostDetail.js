export function PostDetail({ post }) {
  return (
    <div>
      <h1 className="">PostDetail</h1>

      <div className="flex justify-center">
        <div className="flex flex-col w-full border-2 border-black rounded-lg px-4 py-2 max-w-sm">
          <div className="flex items-center space-x-1">
            <div className="text-sm">
              {post?.createdAt && new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
            </div>
            <div>·</div>
            <div className="font-bold">{post.title}</div>
          </div>
          <div className="">{post.content}</div>
        </div>
      </div>
    </div>
  );
}
