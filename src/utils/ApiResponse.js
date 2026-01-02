class ApiResponse{
    constructor(statusCode, data, messsage = "Success"){
        this.statusCode = statusCode
        this.data = datathis.messsage = messsage
        this.success = statusCode < 400
    }
}