// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Counters } from "./Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Beccamose is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    struct TokenMetadata {
        string latitude;
        string longitude;
    }

    mapping(uint256 => TokenMetadata) public tokenMetadata;
    Counters.Counter _nextTokenId;

    constructor(address initialOwner)
        ERC721("Beccamose", "PoM")
        Ownable(initialOwner)
    {}

    function safeMint(address to, string memory latitude, string memory longitude)
        public
        onlyOwner
    {   
        uint256 tokenId = _nextTokenId.current();
        _safeMint(to, tokenId);

        tokenMetadata[tokenId] = TokenMetadata({
            latitude: latitude,
            longitude: longitude
        });

        _nextTokenId.increment();
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        if (tokenId >= _nextTokenId.current()) revert("Token not minted yet");
        TokenMetadata memory metadata = tokenMetadata[tokenId];

        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150">',
            '<text x="0" y="15" font-family="Verdana" font-size="15">Proof of meet</text>',
            '<text x="0" y="25" font-family="Verdana" font-size="10">(se semo beccati)</text>',
            '<text x="0" y="50" font-family="Verdana" font-size="10">Latitude: ', metadata.latitude, '</text>',
            '<text x="0" y="70" font-family="Verdana" font-size="10">Longitude: ', metadata.longitude, '</text>',
            '</svg>'
        ));

        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "Token ', toString(tokenId), '", "description": "Se semo beccati", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '", "attributes": [{"trait_type": "latitude", "value": "', metadata.latitude, '"}, {"trait_type": "longitude", "value": "', metadata.longitude, '"}]}'))));
        string memory output = string(abi.encodePacked('data:application/json;base64,', json));
        
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}