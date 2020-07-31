/**
 * Created by jin on 8/31/17.
 */

const path = require('path');

const Datastore = require('nedb')


const MBlockUsers = new Datastore({ filename: path.join(GConfig.pathDB, 'nedbBlockUsers'), autoload: true, timestampData: true })
const MBlockUserCount = new Datastore({ filename: path.join(GConfig.pathDB, 'nedbBlockUsersCount'), autoload: true, timestampData: true })
const MUserFavoriteLink = new Datastore({ filename: path.join(GConfig.pathDB, 'nedbUserFavoriteLink'), autoload: true, timestampData: true })


exports.MBlockUsers = MBlockUsers
exports.MBlockUserCount = MBlockUserCount
exports.MUserFavoriteLink = MUserFavoriteLink



exports.MUserFavoriteLinkCreateP = async function(newLink) {
    return new Promise((resolve, reject) => {

        MUserFavoriteLink.insert(newLink, function(err, newDoc) {
            if (err) return reject(err);
            return resolve(newDoc);
        });
    });
}
exports.MUserFavoriteLinkUpdateP = async function(query, modifyLink, options) {
    return new Promise((resolve, reject) => {
        options = options || {}
        MUserFavoriteLink.update(query, modifyLink, options, function(err, newDoc) {
            if (err) return reject(err);
            return resolve(newDoc);
        });
    });
}
exports.MUserFavoriteLinkDeleteP = async function(query, options) {
    return new Promise((resolve, reject) => {
        options = options || {}
        MUserFavoriteLink.remove(query, options, function(err, numRemoved) {
            if (err) return reject(err);
            return resolve(numRemoved);
        });
    });
}
exports.MUserFavoriteLinkFindOneP = async function(query) {
    return new Promise((resolve, reject) => {

        MUserFavoriteLink.findOne(query, function(err, doc) {
            if (err) return reject(err);
            return resolve(doc);
        });
    });
}
exports.MUserFavoriteLinkFindP = async function(query) {
    return new Promise((resolve, reject) => {
        query = query || {}
        MUserFavoriteLink.find(query).sort({ createdAt: -1 }).exec(function(err, docs) {
            if (err) return reject(err);
            return resolve(docs);
        });
    });
}


exports.MBlockUsersCreateP = async function(newBlockedUser) {
    return new Promise((resolve, reject) => {

        MBlockUsers.insert(newBlockedUser, function(err, newDoc) {
            if (err) return reject(err);
            return resolve(newDoc);
        });
    });
}
exports.MBlockUsersFindOneP = async function(query) {
    return new Promise((resolve, reject) => {

        MBlockUsers.findOne(query, function(err, doc) {
            if (err) return reject(err);
            return resolve(doc);
        });
    });
}



exports.MBlockUserCountCreateP = async function(newBlockedUserCount) {
    return new Promise((resolve, reject) => {

        MBlockUserCount.insert(newBlockedUserCount, function(err, newDoc) {
            if (err) return reject(err);
            return resolve(newDoc);
        });
    });
}

exports.MBlockUserCountUpdateP = async function(query, modifyBlockedUserCount, options) {
    return new Promise((resolve, reject) => {
        options = options || {}
        MBlockUserCount.update(query, modifyBlockedUserCount, options, function(err, newDoc) {
            if (err) return reject(err);
            return resolve(newDoc);
        });
    });
}

exports.MBlockUserCountFindOneP = async function(query) {
    return new Promise((resolve, reject) => {

        MBlockUserCount.findOne(query, function(err, doc) {
            if (err) return reject(err);
            return resolve(doc);
        });
    });
}

exports.MBlockUserCountFindP = async function(query) {
    return new Promise((resolve, reject) => {
        query = query || {}
        MBlockUserCount.find(query).sort({ count: -1 }).exec(function(err, docs) {
            if (err) return reject(err);
            return resolve(docs);
        });
    });
}