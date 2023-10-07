// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { Counters } from "./Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Beccamose is ERC721, ERC721URIStorage, Ownable {
	using Counters for Counters.Counter;

	struct TokenMetadata {
		address address1;
		address address2;
	}

	mapping(uint256 => TokenMetadata) public tokenMetadata;
	Counters.Counter _nextTokenId;

	constructor() ERC721("Beccamose", "PoM") {}

	function safeMint(
		address to,
		address address1,
		address address2
	) public onlyOwner {
		uint256 tokenId = _nextTokenId.current();
		_safeMint(to, tokenId);

		tokenMetadata[tokenId] = TokenMetadata({
			address1: address1,
			address2: address2
		});

		_nextTokenId.increment();
	}

	function tokenURI(
		uint256 tokenId
	) public view override(ERC721, ERC721URIStorage) returns (string memory) {
		if (tokenId >= _nextTokenId.current()) revert("Token not minted yet");
		TokenMetadata memory metadata = tokenMetadata[tokenId];

		string memory svg = string(
			abi.encodePacked(
				'<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
				"<style>.base { fill: white; font-family: serif; }</style>",
				'<rect width="100%" height="100%" fill="black" />',
				'<text x="50%" y="30%" font-size="15" class="base" dominant-baseline="middle" text-anchor="middle">Proof of meet</text>',
				'<text x="50%" y="35%" font-size="10" class="base" dominant-baseline="middle" text-anchor="middle">(se semo beccati)</text>',
				'<text x="50%" y="55%" font-size="10" class="base" dominant-baseline="middle" text-anchor="middle">',
				addressToString(metadata.address1),
				"</text>",
				'<svg xmlns="http://www.w3.org/2000/svg" x="47%" y="60%" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
				'<text x="50%" y="72%" font-size="10" class="base" dominant-baseline="middle" text-anchor="middle">',
				addressToString(metadata.address2),
				"</text>",
				"</svg>"
			)
		);

		string memory json = Base64.encode(
			bytes(
				string(
					abi.encodePacked(
						'{"name": "Token ',
						toString(tokenId),
						'", "description": "Se semo beccati", "image": "data:image/svg+xml;base64,',
						Base64.encode(bytes(svg)),
						'", "attributes": [{"trait_type": "address1", "value": "',
						addressToString(metadata.address1),
						'"}, {"trait_type": "address2", "value": "',
						addressToString(metadata.address2),
						'"}]}'
					)
				)
			)
		);
		string memory output = string(
			abi.encodePacked("data:application/json;base64,", json)
		);

		return output;
	}

	function toString(uint256 value) internal pure returns (string memory) {
		if (value == 0) {
			return "0";
		}
		uint256 temp = value;
		uint256 digits;
		while (temp != 0) {
			digits++;
			temp /= 10;
		}
		bytes memory buffer = new bytes(digits);
		while (value != 0) {
			digits -= 1;
			buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
			value /= 10;
		}
		return string(buffer);
	}

	function addressToString(
		address _address
	) public pure returns (string memory) {
		bytes32 _bytes = bytes32(uint256(uint160(_address)));
		bytes memory HEX = "0123456789abcdef";
		bytes memory _string = new bytes(42);
		_string[0] = "0";
		_string[1] = "x";
		for (uint i = 0; i < 20; i++) {
			_string[2 + i * 2] = HEX[uint8(_bytes[i + 12] >> 4)];
			_string[3 + i * 2] = HEX[uint8(_bytes[i + 12] & 0x0f)];
		}
		return string(_string);
	}

	function supportsInterface(
		bytes4 interfaceId
	) public view override(ERC721, ERC721URIStorage) returns (bool) {
		return super.supportsInterface(interfaceId);
	}

	/**
	 * @dev Blocks the burn function
	 * @param _tokenId The ID of the token
	 */
	function _burn(
		uint256 _tokenId
	) internal virtual override(ERC721, ERC721URIStorage) {}
}
