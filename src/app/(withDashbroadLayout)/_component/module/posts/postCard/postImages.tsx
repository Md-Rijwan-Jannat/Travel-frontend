import { FC } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import Link from "next/link";
import Image from "next/image";
import { TPost } from "@/src/types";

type TPostImagesProps = { post: TPost };

const PostImages: FC<TPostImagesProps> = ({ post }) => {
  const { images } = (post as TPost) || {};

  if (!images || images.length === 0) return null;

  const showMoreCount = images.length > 3 ? images.length - 3 : 0;

  return (
    <div className="relative">
      <LightGallery
        elementClassNames={`grid gap-2 ${
          images.length === 1
            ? "grid-cols-1"
            : images.length === 2
              ? "grid-cols-2"
              : "grid-cols-3"
        } mt-2`}
        plugins={[lgThumbnail, lgZoom]}
        speed={500}
      >
        {images.slice(0, 3).map((image, index) => (
          <Link key={index} href={image} data-lg-size="1600-2400">
            <Image
              alt={`image${index}`}
              className={`object-cover object-center ${
                images.length === 1
                  ? "h-[300px] w-full"
                  : images.length === 2
                    ? "h-[250px] w-full"
                    : "h-[250px]"
              }`}
              height={images.length === 1 ? 300 : 250}
              src={image}
              width={500}
            />
          </Link>
        ))}
      </LightGallery>

      {/* Show overlay on the last image with "See More" text if more images are present */}
      {showMoreCount > 0 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 rounded-lg px-2 pb-1 pt-0.5">
          <Link
            href={`/news-feed/posts/${post?._id}`}
            className="text-white font-semibold text-xs"
          >
            +{showMoreCount} more
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostImages;
