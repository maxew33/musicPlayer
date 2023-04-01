export default class Media {
    constructor(data, id) {
        this._id = id
        this._image = data.image
        this._video = data.video
        this._title = data.title
        this._date = data.date
        this._likes = data.likes
    }

    get imagePath() {
        return `./assets/sample-photos/${this._id}/${this._image}`
    }

    get minImagePath() {
        return `./assets/sample-photos/min/${this._id}/${this._image}`
    }

    get videoPath() {
        return `./assets/sample-photos/${this._id}/${this._video}`
    }

    get altText() {
        return this._title
    }

    get minAltText() {
        return `${this._title}, closeup view`
    }

    get title() {
        return this._title
    }

    get date() {
        return this._date
    }

    get likes() {
        return this._likes
    }

}