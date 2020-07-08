/**
 * Created by jin on 8/31/17.
 */


/**
 * Created by jin on 8/16/17.
 */



/**
 * Mongoose schema
 */

const FormModelSchema = new GSchema({

    modelSchema: { type: String},
    uiSchema: { type: String}


}, {
    toObject: { virtuals: false },
    toJSON: { virtuals: false },
    timestamps: true
})




/**
 * Mongoose schema index
 */


// FormModelSchema.index({username: 1})




/**
 * Mongoose plugin
 */

// FormModelSchema.plugin(mongooseTimestamps)




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

FormModelSchema.statics.findAll = function(query){
    return FormModel.find(query).select(field.common).exec()
}
FormModelSchema.statics.find1 = function(query){
    return FormModel.findOne(query).select(field.common).exec()
}
FormModelSchema.statics.find1ById = function(id){
    return FormModel.findById(id).select(field.common).exec()
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

const FormModel = GMongoose.model("FormModel", FormModelSchema)
module.exports = FormModel


