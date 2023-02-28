import ballerina/http;
import ballerina/io;

// @http:ServiceConfig {
//     chunking: http:CHUNKING_ALWAYS
// }
// service / on new http:Listener(9090, httpVersion = http:HTTP_1_1) {
service / on new http:Listener(9090) {

    resource function post receiver(http:Request request) returns string {
        stream<byte[], io:Error?>|http:ClientError streamer = request.getByteStream();
        if(streamer is stream<byte[], io:Error?>){
            return "File Received!";
        }else{
            return "Error!";
        }
    }
}