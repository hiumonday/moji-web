import React from "react";
import {
  ClockIcon,
  CalendarIcon,
  UserIcon,
  BookOpenIcon,
  GlobeAltIcon,
  UsersIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const CartCard = ({ course, removeFromCart, i18n }) => {
  const handleRemoveFromCart = async () => {
    removeFromCart(course._id, course.classInfo.classId);
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Course Image */}
        <div className="w-full sm:w-48 h-32 relative rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={course.image || "/placeholder.svg?height=128&width=192"}
            alt={course.title}
            width={192}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Course Information */}
        <div className="flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-grow">
              <h3 className="text-lg sm:text-xl font-semibold">
                {course.title}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                x {course.participants.length}
              </div>
            </div>
          </div>

          {/* Teacher Name */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <UserIcon className="h-4 w-4 mr-2" />
            <span>{course.classInfo.teacherName}</span>
          </div>

          {/* Language and Level */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <GlobeAltIcon className="h-4 w-4 mr-1" />
              <span>{course.classInfo.language}</span>
            </div>
            <span className="hidden sm:inline text-gray-300">•</span>
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <BookOpenIcon className="h-4 w-4 mr-1" />
              <span>{course.classInfo.level}</span>
            </div>
          </div>

          {/* Time and Day */}
          <div className="flex flex-wrap items-center gap-2 text-gray-600 text-xs sm:text-sm mb-4">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{`${course.classInfo.startTime} - ${course.classInfo.endTime}`}</span>
            </div>
            <span className="hidden sm:inline text-gray-300">•</span>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{course.classInfo.day}</span>
            </div>
            <div className="ml-auto flex">
              <button
                className="flex items-center text-red-500 hover:text-red-800 transition-colors duration-200"
                onClick={handleRemoveFromCart}
              >
                <TrashIcon className="h-5 w-5 mr-1" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Participants */}
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">
              {i18n === "en" ? "Participants:" : "Người tham gia:"}
            </h4>
            {course.participants.map((participant, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span className="text-sm text-gray-700">
                  {participant.info.name}
                </span>
                <span className="text-sm text-gray-900 font-semibold">
                  ({participant.discount_type})
                  <div className="text-gray-500 line-through inline">
                    đ{course.price.toLocaleString()}
                  </div>{" "}
                  đ{participant.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
