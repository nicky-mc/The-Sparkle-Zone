//navigation to go back and forth between pages and a return to the main blog page
//need to use params to render each single blog post dynamically

// we ill need to get posts from db filtering by id {where id = $} {params.id}
// for each post we will need to get the category name {SELECT FROM categories WHERE id = $} {post.category_id}

// we will need to get the image for the post {SELECT FROM post where post_id =$ } {params.id} the sql query will be as follows {SELECT * FROM images WHERE post_id = $}
// we will need to get the author for the post {SELECT FROM post where post_id =$ } {params.id} the sql query will be as follows {SELECT * FROM authors WHERE post_id = $}
// we will need to get the date for the post {SELECT FROM post where post_id =$ } {params.id} the sql query will be as follows {SELECT * FROM dates WHERE post_id = $}
// we will need to get the content for the post {SELECT FROM post where post_id =$ } {params.id} the sql query will be as follows {SELECT * FROM content WHERE post_id = $}

// we will also need to get the comments for the post {SELECT FROM post where post_id =$ } {params.id} the sql query will be as follows {SELECT * FROM comments WHERE post_id = $}
//likes for the post {SELECT FROM post where post_id =$ } {params.id} the sql query will be as follows {SELECT * FROM likes WHERE post_id = $}
//for the comments we will need to get the author for the comment {SELECT FROM comments where comment_id =$ } {comment.id} the sql query will be as follows {SELECT * FROM authors WHERE comment_id = $}
//to allow users to add comments we will need to create a form that will allow users to add comments to the post
//we will also need to create a form that will allow users to like the post
//we will need to create a form that will allow users to share the post
//we will need to create a form that will allow users to report the post
// the logic for the forms will be created in a new file called post.js in the same directory
// we will need to create a form that will allow users to add comments to the post
