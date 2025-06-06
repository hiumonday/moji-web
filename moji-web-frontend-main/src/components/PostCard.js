import React from 'react';

const PostCard = ({ post }) => {
 
    if (!post) {
        return null; // or some fallback UI
    }


    const author = post?.authors && post.authors[0];
    const tag = post?.tags && post.tags[0];
    return (
        <article className="grid sm:grid-cols-4 grid-cols-3 gap-4 bg-transparent overflow-hidden py-6 border-b w-full pr-4 md:pl-0 pl-2">
        <div className="px-2 py-1 sm:col-span-3 col-span-2">
            <a href={`/blog/${post.slug}`} className="block">
                <header>
                    <div className="py-1 mt-2">
                        <img src={author?.profile_image} alt={author?.name} className="hidden sm:inline-block h-8 w-8 rounded-full mr-3" />
                        <a href={`/blog/authors/${post.authors[0].slug}`} className="text-gray-800 text-sm font-thin">{author?.name}</a>
                        <span className='text-gray-500 text-sm font-thin'> in </span>
                        <span className="inline-block  uppercase text-black mr-2 text-sm font-thin">{tag?.name}</span>
                    </div>
                    <h2 className="my-2 text-xl font-semibold text-gray-900 author">{post.title}</h2>
                    <h2 className="mb-1 text-md text-gray-600 author hidden sm:block w-[90%]">{post.excerpt}</h2>
                </header>
            </a>
            <footer className="text-sm text-gray-500 flex justify-start items-center mt-2">
                {/* <span className="text-sm">{post.reading_time} min read</span>
                <span className="mx-2 text-2xl">·</span> */}
                {new Date(post.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </footer>
        </div>
        {post.feature_image && (
            <a href={`/blog/${post.slug}`} className='my-auto'>
                <div className="aspect-w-64 aspect-h-36 overflow-hidden">
                <img className="w-[95%] h-[95%] sm:w-[88%] sm:h-auto object-cover"

                        src={post.feature_image}
                        alt={post.feature_image_alt || post.title}
                        loading="lazy"
                    />
                </div>
            </a>
        )}
    </article>
);
};

export default PostCard;