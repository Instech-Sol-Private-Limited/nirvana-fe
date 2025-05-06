import React from "react";
import { popularTopics } from "../data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PopularTopics = () => {
  return (
    <div className="w-full md:mt-40 mt-28 space-y-6">
      <h2 className="xl:max-w-[500px] py-9 w-full font-montserrat font-bold lg:text-[44px] md:text-4xl xl:text-left text-center text-3xl text-primary !leading-normal">
        Popular Topics
      </h2>

      <p className="text-textlight md:text-xl text-lg font-roboto">
        Check out trending discussions in the education community.
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="col-span-2">Topic Title</TableHead>
            <TableHead>Replies</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {popularTopics.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="col-span-2">{item.title}</TableCell>
              <TableCell>{item.replies}</TableCell>
              <TableCell>{item.views}</TableCell>
              <TableCell>{item.last_updated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PopularTopics;
