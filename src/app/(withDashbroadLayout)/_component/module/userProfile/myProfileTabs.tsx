"use client";

import React, { useState } from "react";
import {
  useGetMyPostsQuery,
  useGetMyPremiumPostsQuery,
} from "@/src/redux/features/post/postApi";
import { TPost } from "@/src/types";
import { Tab, Tabs } from "@nextui-org/tabs";
import { motion } from "framer-motion";
import PostCard from "../../module/posts/postCard/postCard";
import Spinner from "@/src/components/ui/spinner";
import InfiniteScrollContainer from "@/src/components/ui/infiniteScrollerContainer";

export default function MyProfileTabs() {
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { data: myPostsData, isFetching: isFetchingMyPosts } =
    useGetMyPostsQuery(undefined);
  const myPosts = myPostsData?.data as TPost[];

  const { data: myPremiumPostsData, isFetching: isFetchingMyPremiumPosts } =
    useGetMyPremiumPostsQuery(undefined);
  const myPremiumPosts = myPremiumPostsData?.data as TPost[];

  // Function to load more posts when scrolled to bottom
  const loadMorePosts = async () => {
    if (!isFetchingMore) {
      setIsFetchingMore(true);
      setPage((prevPage) => prevPage + 1);
      setIsFetchingMore(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <Tabs aria-label="Options" className="w-full md:w-[500px] xl:w-[600px]]">
        <Tab key="posts" className="w-full" title="My Posts">
          <InfiniteScrollContainer onBottomReached={loadMorePosts}>
            <motion.div className="grid grid-cols-1 gap-5 p-2">
              {isFetchingMyPosts && isFetchingMore ? (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              ) : (
                myPosts?.map((post) => <PostCard key={post._id} post={post} />)
              )}
            </motion.div>
          </InfiniteScrollContainer>
        </Tab>

        <Tab key="my-premium-posts" className="w-full" title="My Premium Posts">
          <InfiniteScrollContainer onBottomReached={loadMorePosts}>
            <motion.div className="grid grid-cols-1 gap-5 p-2">
              {isFetchingMyPremiumPosts && isFetchingMore ? (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              ) : (
                myPremiumPosts?.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))
              )}
            </motion.div>
          </InfiniteScrollContainer>
        </Tab>

        <Tab
          key="my-subscribed-posts"
          className="w-full"
          title="My Subscribed Posts"
        >
          <InfiniteScrollContainer onBottomReached={loadMorePosts}>
            <motion.div className="grid grid-cols-1 gap-5 p-2">
              {isFetchingMyPremiumPosts && isFetchingMore ? (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              ) : (
                myPremiumPosts?.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))
              )}
            </motion.div>
          </InfiniteScrollContainer>
        </Tab>
      </Tabs>
    </motion.div>
  );
}
