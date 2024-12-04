import React from 'react';

const AuthorCard = ({ post }) => {
 
    const tag = post.tags && post.tags[0];
    return (
        <article className="grid sm:grid-cols-4 grid-cols-3 bg-transparent overflow-hidden py-6 pr-3 border-b w-full">
            <div className="px-2 py-1 sm:col-span-3 col-span-2">
                <a href={`/blog/${post.slug}`} className="block">
                    <header>
                        <div className="py-1 mt-2">
                            <span className='text-gray-500 text-sm font-thin'> in </span>
                            <span className="inline-block  uppercase text-black mr-2 text-sm font-thin">{tag?.name}</span>
                        </div>
                        <h2 className="my-2 text-xl font-semibold text-gray-900 author">{post.title}</h2>
                        <h2 className="mb-1 text-md text-gray-600 author hidden sm:block w-[90%]">{post.excerpt}</h2>
                    </header>
                </a>
                <footer className="text-sm text-gray-500 flex justify-start items-center">
                    <span className="text-sm">{post.reading_time} min read</span>
                    <span className="mx-2 text-2xl">·</span>
                    {new Date(post.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </footer>
            </div>
            {post.feature_image && (
            <a href={`/blog/${post.slug}`} className='my-auto'>
                <div className="aspect-w-64 aspect-h-36 overflow-hidden">
                    <img className="w-[95%] h-[95%] sm:w-[90%] sm:h-auto object-cover"
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

export default AuthorCard;