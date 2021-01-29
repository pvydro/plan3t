const clipper = require('image-clipper')

export class ImageUtils {
    private constructor() {}

    static get Manipulator(): typeof clipper {
        return clipper
    }
}
