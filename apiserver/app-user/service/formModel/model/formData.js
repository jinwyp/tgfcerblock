

/**
 * Mongoose schema
 */

const FormDataSchema = new GSchema({

    modelSchemaId: { type: String},
    postData: { type: String}

}, {
    toObject: { virtuals: false },
    toJSON: { virtuals: false },
    timestamps: true
})




/**
 * Mongoose schema index
 */


// FormDataSchema.index({username: 1})




/**
 * Mongoose plugin
 */

// FormDataSchema.plugin(mongooseTimestamps)




/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */





/**
 * Mongoose Schema Statics
 *
 * http://mongoosejs.com/docs/guide.html
 *
 */


const field = {
    common : "-__v -updatedAt"
}

FormDataSchema.statics.findAll = function(query){
    return FormData.find(query).select(field.common).exec()
}
FormDataSchema.statics.find1 = function(query){
    return FormData.findOne(query).select(field.common).exec()
}
FormDataSchema.statics.find1ById = function(id){
    return FormData.findById(id).select(field.common).exec()
}





/**
 * Mongoose Schema Instance Methods
 *
 * Instances of Models are documents. Documents have many of their own built-in instance methods. We may also define our own custom document instance methods too.
 *
 * http://mongoosejs.com/docs/guide.html
 */





/**
 * Register Model
 */

const FormData = GMongoose.model("FormData", FormDataSchema)
module.exports = FormData


