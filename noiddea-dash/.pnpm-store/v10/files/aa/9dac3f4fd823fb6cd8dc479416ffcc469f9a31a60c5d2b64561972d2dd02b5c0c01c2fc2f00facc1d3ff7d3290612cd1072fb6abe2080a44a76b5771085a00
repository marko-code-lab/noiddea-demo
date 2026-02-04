import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from "aws-lambda";
import type { ServerRequest } from "srvx";
export declare function awsRequest(event: APIGatewayProxyEvent | APIGatewayProxyEventV2, context: unknown): ServerRequest;
export declare function awsResponseHeaders(response: Response);
export declare function awsResponseBody(response: Response): Promise<{
	body: string;
	isBase64Encoded?: boolean;
}>;
