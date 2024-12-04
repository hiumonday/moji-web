import React from 'react';

const SmallCard = ({ post }) => {
 
    if (!post) {
        return null; // or some fallback UI
    }

    const author = post.authors && post.authors[0];
    const tag = post.tags && post.tags[0];
    return (
        <article style={{ margin: '0 auto' }} className="bg-transparent overflow-hidden p-4 flex flex-col">
            {post.feature_image && (
                <a href={`/blog/${post.slug}`}>
                    <img className="w-full h-44 object-cover"
                        src={post.feature_image}
                        alt={post.feature_image_alt || post.title}
                        loading="lazy"
                    />
                </a>
            )}

            <div className="px-2 py-1 flex-grow flex flex-col">
                <a href={`/blog/${post.slug}`} className="block flex-grow">
                    <header>
                        <div className="py-1 mt-2">
                            <img src={author?.profile_image} alt={author?.name} className="inline-block h-8 w-8 rounded-full mr-3" />
                            <a href={`/blog/authors/${author?.slug}`} className="text-gray-800 text-sm font-thin">{author?.name}</a>
                            <span className='text-gray-500 text-sm font-thin'> in </span>
                            <span className="inline-block  uppercase text-black mr-2 text-sm font-thin">{tag?.name}</span>
                        </div>
                        <h2 className="my-2 text-xl font-semibold text-gray-900 author">{post.title}</h2>
                        <h2 className="mb-1 text-md text-gray-600 author author">{post.excerpt}</h2>

                    </header>
                    {/* <section className="mt-1 text-gray-600">
                        <p>{post.excerpt}</p>
                    </section> */}
                </a>
                <footer className="text-sm text-gray-500 flex justify-start items-center">
                    <span className="text-sm">{post.reading_time} min read</span>
                    <span className="mx-2 text-2xl">·</span>
                    {new Date(post.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </footer>
            </div>
        </article>
    );
};

export default SmallCard;