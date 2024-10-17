//navigation to go back and forth between pages and a return to the main blog page
//need to use params to render each single blog post dynamically

// we ill need to get posts from db filtering by id {where id = $} {params.id}

// we will also need to get the comments for the post {SELECT FROM post where post_id =$ } {params.id} the sql query will be as follows {SELECT * FROM comments WHERE post_id = $}
