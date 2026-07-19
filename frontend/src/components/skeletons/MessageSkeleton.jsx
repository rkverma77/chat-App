const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className={`flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}>
          <div className={`flex items-end gap-2 max-w-[75%] ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
            
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="skeleton w-10 h-10 rounded-full" />
            </div>

            {/* Bubble and Timestamp */}
            <div className="flex flex-col gap-1">
              {/* Bubble skeleton */}
              <div
                className={`p-3 skeleton h-16 w-[200px] ${
                  idx % 2 === 0 ? "rounded-2xl rounded-bl-sm" : "rounded-2xl rounded-br-sm"
                }`}
              />
              {/* Timestamp skeleton */}
              <div className={`skeleton h-4 w-16 ${idx % 2 === 0 ? "self-start" : "self-end"} rounded`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
