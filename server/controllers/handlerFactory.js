const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/APIFeatures');

const excludeFields = (object, ...excludedFields) => {
  const newObj = {};

  Object.keys(object).forEach((field) => {
    if (!excludedFields.includes(field)) {
      newObj[field] = object[field];
    }
  });

  return newObj;
};

exports.deleteOne = (Model) =>
  catchAsync(async (req, resp, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('Document not found', '404'));
    }

    return resp.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, resp, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });

    if (!doc) {
      return next(new AppError('No document found', 404));
    }

    return resp.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, resp, next) => {
    let fields = excludeFields(req.body, 'role');
    
    const newDoc = await Model.create(fields);

    return resp.status(201).json({
      status: 'success',
      data: {
        newDoc,
      },
    });
  });

exports.getOne = (Model, populateOptions = null) =>
  catchAsync(async (req, resp, next) => {

    let query = Model.findById(req.params.id);

    if (populateOptions) query.populate(populateOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError('Doc not found', '404'));
    }

    return resp.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, resp, next) => {
    let filter = {};

    if (req.params.book) filter = {...filter, book: req.params.book };
    if (req.params.userId) filter = {...filter, seller : req.params.userId}

    let apiFeatures = new ApiFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();

    const docs = await apiFeatures.query;

    return resp.status(200).json({
      status: 'succed',
      results: docs.length,
      data: {
        docs,
      },
    });
  });
