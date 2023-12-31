import protobuf from "protobufjs";

export const CONTENT_TOPIC = "/beccamose/3/location-sharing/proto";

export const LocationMessage = new protobuf.Type("LocationMessage")
  .add(new protobuf.Field("timestamp", 1, "uint64"))
  .add(new protobuf.Field("sender", 2, "string"))
  .add(new protobuf.Field("message", 3, "string"))
  .add(new protobuf.Field("nonce", 4, "uint64"));
