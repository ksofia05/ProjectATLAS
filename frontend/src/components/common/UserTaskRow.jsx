import React from "react";

const UserTaskRow = ({
  initials,
  name,
  rightContent,
  rightContentClass = "",
  avatarBg = "bg-purple-400",
  avatarText = "text-zinc-900",
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className={`${avatarBg} ${avatarText} font-bold rounded-full w-8 h-8 flex items-center justify-center text-base`}>
        {initials}
      </span>
      <span className="text-gray-100 text-base">{name}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-zinc-500 inline-block"></span>
      <span className={`text-base ${rightContentClass}`}>{rightContent}</span>
    </div>
  </div>
);

export default UserTaskRow;