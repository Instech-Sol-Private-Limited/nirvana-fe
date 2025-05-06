import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import WrapperContainer from "@/components/addons/containers/WrapperContainer";
import { allDiscusssions } from "../data";
import ForumReviewCard from "./ForumReviewCard";
import StartDiscussion from "./StartDiscussion";

const Discussions = ({ category }: { category: string }) => {
  const [selectedFilter, setSelectedFilter] = useState("Latest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <WrapperContainer innerClassName="pb-20 flex flex-col items-center gap-[30px]">
        {/* Tab Content */}
        <div className="w-full mt-[65px] flex justify-center">
          {allDiscusssions.map((item) => (
            <React.Fragment key={item.id}>
              {item.slug === category ? (
                <div className="max-w-[906px] !w-full">
                  {/* Filter & Button */}
                  <div className="w-full flex flex-wrap gap-5 justify-between items-center mt-6">
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-[35px] px-5 py-2.5 rounded-2xl border-2 border-textdark/50 md:text-sm text-xs text-textdark font-semibold transition-all duration-300"
                      >
                        {selectedFilter}{" "}
                        <ChevronDown className="h-5 w-5 ml-2" />
                      </button>

                      {isDropdownOpen && (
                        <ul className="absolute top-[calc(100%+10px)] w-[200px] bg-white p-1 shadow-accordion rounded-xl z-10 transition-all duration-300 opacity-100 scale-100">
                          {["Latest", "A-Z"].map((option) => (
                            <li
                              key={option}
                              onClick={() => {
                                setSelectedFilter(option);
                                setIsDropdownOpen(false);
                              }}
                              className="px-4 py-3 text-textdark cursor-pointer rounded-md transition-all duration-200 hover:bg-gray-200"
                            >
                              {option}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <StartDiscussion />
                  </div>

                  {/* Discussion Cards */}
                  <div className={`mt-[45px] space-y-6`}>
                    {item.discussions.length > 0 ? (
                      item.discussions.map((discussion) => (
                        <React.Fragment key={discussion.id}>
                          <ForumReviewCard
                            discussion={discussion}
                            index={discussion.id}
                            category={item.slug}
                          />
                        </React.Fragment>
                      ))
                    ) : (
                      <div className="w-full p-7 text-center">
                        No discussion found!
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </WrapperContainer>
    </>
  );
};

export default Discussions;
