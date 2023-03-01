import ballerina/http;
import ballerina/io;

// @http:ServiceConfig {
//     chunking: http:CHUNKING_ALWAYS
// }
// service / on new http:Listener(9090, httpVersion = http:HTTP_1_1) {
service / on new http:Listener(9090) {

    resource function post UploadChunks/[string id]/[string name](http:Request request) returns json {
        stream<byte[], io:Error?>|http:ClientError streamer = request.getByteStream();
        if(streamer is stream<byte[], io:Error?>){
            return {isSuccess: true};
        }else{
            return {isSuccess: false};
        }
    }

    resource function post UploadComplete(@http:Payload json payload) returns json {
        json|error? name = payload.name;
        if(name is string){
            return {isSuccess: true};
        }else{
            return {isSuccess: false};
        }
    }
}