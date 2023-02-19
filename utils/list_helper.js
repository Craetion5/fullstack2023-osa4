const blog = require("../models/blog")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    var likes = 0
    blogs.map(blog => likes += blog.likes)
    return likes
}

const favoriteBlog = (blogs) => {
    var bestBlogIndex = 0
    var bestBlogLikes = 0
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > bestBlogLikes) {
            bestBlogIndex = i
            bestBlogLikes = blogs[i].likes
        }
    }
    return {
        title: blogs[bestBlogIndex].title,
        author: blogs[bestBlogIndex].author,
        likes: blogs[bestBlogIndex].likes
    }
}

//this should use a map
const mostBlogs = (blogs) => {
    var mostName = "Mark Zuckerberg"
    var mostBlogs = 0
    var skipsLeft = 0
    var skipsMax = 0
    var locked = true
    while (locked) {
        locked = false
        var currentName = ""
        var instancesFound = 0
        for (let i = 0; i < blogs.length; i++) {
            if (blogs[i].author === currentName) {
                instancesFound++
                if (instancesFound > mostBlogs) {
                    mostBlogs = instancesFound
                    mostName = blogs[i].author
                }
            } else if (currentName === "" && skipsLeft <= 0) {
                currentName = blogs[i].author
                locked = true
                instancesFound++
                if (instancesFound > mostBlogs) {
                    mostBlogs = instancesFound
                    mostName = blogs[i].author
                }
            } else {
                skipsLeft--;
            }
        }
        skipsMax++
        skipsLeft = skipsMax
    }
    return {
        author: mostName,
        blogs: mostBlogs
    }
}

const mostLikes = (blogs) => {
    var mostName = "Mark Zuckerberg"
    var mostLikes = 0
    var skipsLeft = 0
    var skipsMax = 0
    var locked = true
    while (locked) {
        locked = false
        var currentName = ""
        var likesFound = 0
        for (let i = 0; i < blogs.length; i++) {
            if (blogs[i].author === currentName) {
                likesFound += blogs[i].likes
                if (likesFound > mostLikes) {
                    mostLikes = likesFound
                    mostName = blogs[i].author
                }
            } else if (currentName === "" && skipsLeft <= 0) {
                currentName = blogs[i].author
                locked = true
                likesFound += blogs[i].likes
                if (likesFound > mostLikes) {
                    mostLikes = likesFound
                    mostName = blogs[i].author
                }
            } else {
                skipsLeft--;
            }
        }
        skipsMax++
        skipsLeft = skipsMax
    }
    return {
        author: mostName,
        likes: mostLikes
    }
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}