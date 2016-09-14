package framework.comments;

/**
 * Created by Pascal on 01.03.2016.
 */
public class Comment {
    public String author = "";
    ;
    public String content = "";
    ;
    public String date = "";
    public int numUpvotes;
    public String filename = "";
    public String url = "";
    public String id = "";

    public Comment createMessageComment(String author, String content, String id, int numUpvotes) {
        this.author = author;
        this.content = content;
        this.id = id;
        this.numUpvotes = numUpvotes;

        return this;
    }

    public Comment createFileComment(String author, String filename, String id, int numUpvotes) {
        Comment info = this.createMessageComment(author, filename, id, numUpvotes);
        info.filename = filename;
        info.url = "blob:http";
        return info;
    }

    public boolean equals(Comment c) {
        return this.author.equals(c.author) &&
                this.content.equals(c.content) &&
                this.date.equals(c.date) &&
                this.numUpvotes == c.numUpvotes &&
                this.filename.equals(c.filename) &&
                sameUrl(c.url) &&
                this.id.equals(c.id);
    }

    public boolean equalsWithoutDate(Comment c) {
        return this.author.equals(c.author) &&
                this.content.equals(c.content) &&
                this.numUpvotes == c.numUpvotes &&
                this.filename.equals(c.filename) &&
                sameUrl(c.url) &&
                this.id.equals(c.id);
    }

    public boolean equalsWithoutAuthor(Comment c) {
        return this.content.equals(c.content) &&
                this.date.equals(c.date) &&
                this.numUpvotes == c.numUpvotes &&
                this.filename.equals(c.filename) &&
                sameUrl(c.url) &&
                this.id.equals(c.id);
    }

    private boolean sameUrl(String commentUrl) {
        if (!this.url.equals("")) {
            final String blobUrl = "blob:http";
            return this.url.startsWith(blobUrl) &&
                    commentUrl.startsWith(blobUrl);
        } else {
            return this.url.equals(commentUrl);
        }
    }
}
